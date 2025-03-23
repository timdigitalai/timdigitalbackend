const validRoles = ["tourist", "business_owner", "admin"];

app.post('/auth/signup', async (req, res) => {
    try {
        let { name, email, password, role } = req.body;

        if (!validRoles.includes(role)) {
            role = "tourist";  // ✅ Default role fix
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ name, email, password, role });
        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
