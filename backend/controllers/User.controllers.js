import { User } from "../models/User.models.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/email.js";

const Signup = async (req, res) => {
    const { username, email, password, passwordConfirm } = req.body;

    try {
        if (!username || !email || !password || !passwordConfirm) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User({
            username,
            email,
            otp,
            passwordConfirm,
            otpExpires: Date.now() + 24 * 60 * 60 * 1000,
            password,
        });


        await newUser.save();
        newUser.otp = otp;
        console.log(newUser.email)
        try {
            await sendEmail(newUser.email, "OTP for Email Verification", `<h1>Your OTP is ${otp}</h1>`);
        } catch (error) {
            console.error("Email sending failed:", error.message);
            await User.findByIdAndDelete(newUser._id);
            return res.status(500).json({ success: false, message: "Error sending email" });
        }

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '90d' });

        // Prepare user data for response — remove sensitive fields
        const userToSend = newUser.toObject();
        delete userToSend.password;
        delete userToSend.otp;
        delete userToSend.otpExpires;
        delete userToSend.passwordConfirm;

        res.status(201)
            .cookie("token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            })
            .json({
                success: true,
                message: "User created successfully",
                user: userToSend,
                token,
            });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Cookie expires in 24h
            secure: process.env.NODE_ENV === "production", // Set to true in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Set to 'none' in production
        }).json({
            success: true,
            message: "User logged in successfully",
            user,
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const verifyAccount = async (req, res) => {
    const { otp } = req.body;

    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }       

        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }
        user.isVerified = true;

        user.otp = undefined;
        user.otpExpires = undefined;
        user.passwordConfirm = undefined;
        await user.save({validateBeforeSave: false});
        
        res.status(200).json({ success: true, message: "Account verified successfully", user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message,  });
    }
}

const resendOTP = async (req, res) => {
    const { email } = req.user;
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "User already verified" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 24 * 60 * 60 * 1000; // OTP expires in 24 hours
        await user.save({ validateBeforeSave: false });
        try {
            await sendEmail(user.email, "OTP for Email Verification", `<h1>Your OTP is ${otp}</h1>`);
        } catch (error) {
            console.error("Email sending failed:", error.message);
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({ success: false, message: "Error sending email" });
        }
        res.status(200).json({ success: true, message: "A new OTP resent successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const Logout = async (req, res) => {
    try {
       res.status(200).cookie('token',"", {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        }).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpires = Date.now() + 24 * 60 * 60 * 1000; // OTP expires in 24 hours
        await user.save({ validateBeforeSave: false });
        try {
            await sendEmail(user.email, "OTP for Password Reset", `<h1>Your OTP is ${otp}</h1>`);
        } catch (error) {
            console.error("Email sending failed:", error.message);
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({ success: false, message: "Error sending email" });
        }
        res.status(200).json({ success: true, message: "A new OTP resent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const resetPassword = async (req, res) => {
    
    try {
        const { otp, email, password, passwordConfirm } = req.body;
        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordOTPExpires: { $gt: Date.now() } // Check if OTP is still valid
        })
        console.log(user)
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        user.password = password;
        user.passwordConfirm = passwordConfirm;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;
        await user.save();
        res.status(200).json({ success: true, message: "Password reset successfully",user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export { Signup, Login, verifyAccount,resendOTP ,Logout, resetPassword, forgotPassword };