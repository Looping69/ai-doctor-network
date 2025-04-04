import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Placeholder for user data structure (replace with actual data source/context later)
interface UserProfileData {
    name: string;
    specialty: string;
    email: string;
    phone: string;
    // Add other relevant fields like NPI, license, address etc.
}

const ProfileSection = () => {
    // Simulate fetching user data (replace with actual data fetching)
    const [profileData, setProfileData] = useState<UserProfileData>({
        name: 'Dr. Jane Doe', // Placeholder
        specialty: 'Cardiology', // Placeholder
        email: 'jane.doe@example.com', // Placeholder
        phone: '555-123-4567', // Placeholder
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Simulate saving data
        console.log("Saving profile data:", profileData);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
        // Add actual API call here later
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
            // Optionally reset changes if canceling edit, or fetch fresh data
            // For now, just toggle state
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Provider Profile</CardTitle>
                <CardDescription>Manage your professional information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={profileData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="specialty">Specialty</Label>
                        <Input
                            id="specialty"
                            name="specialty"
                            value={profileData.specialty}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    {/* Add more fields here as needed */}
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={handleEditToggle}>Cancel</Button>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </>
                    ) : (
                        <Button onClick={handleEditToggle}>Edit Profile</Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfileSection;
