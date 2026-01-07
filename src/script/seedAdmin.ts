import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewere/auth";

async function seedAdmin() {
    try {
        // check if user exist or not
        const adminData = {
            email: "admin2@admin.com",
            name: 'Admin Myself',
            role: UserRole.ADMIN,
            password: 'admin1234'
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })

        if (existingUser) {
            throw new Error("User already exists!")
        }

        const signUpAdmin = await fetch('http://localhost:5000/api/auth/sign-up/email', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Origin: "http://localhost:5000",
            },
            body: JSON.stringify(adminData)
        })

        if (signUpAdmin.ok) {
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            })
        }

    } catch (error) {
        console.log(error);
    }
}

seedAdmin()