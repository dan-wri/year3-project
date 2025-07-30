import React, { useEffect, useState } from "react";
import { useApi } from "../utils/api.js";

export function MyProfile() {
    const { makeRequest } = useApi();
        const [profile, setProfile] = useState({
        avatar_url: "",
        age: "",
        gender: "",
        bio: "",
        xp: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await makeRequest("profile");
            setProfile(data);
        } catch (err) {
            console.error(err);
            setError("Falied to load profile data.")
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (isLoading) {
        return <div className="loading">Loading profile...</div>
    }

    if (error) {
        return <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchProfile}>Retry</button>
        </div>
    }

    return (
        <div>
            <h2>My Profile</h2>
            <form>
                <div>
                    <label>Avatar URL</label>
                    <input
                        type="text"
                        name="avatar_url"
                        value={profile.avatar_url || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Age</label>
                    <input
                        type="number"
                        name="age"
                        value={profile.age || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Gender</label>
                    <input
                        type="text"
                        name="gender"
                        value={profile.gender || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={profile.bio || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>XP</label>
                    <input
                        type="number"
                        name="xp"
                        value={profile.xp || 0}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </form>

            {profile.avatar_url && (
                <div>
                    <p >Preview:</p>
                    <img
                        src={profile.avatar_url}
                        alt="Avatar"
                    />
                </div>
            )}
        </div>
    );
}
