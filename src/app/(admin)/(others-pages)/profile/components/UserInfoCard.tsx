"use client";

import { useAuthContext } from "@/context";

type InfoRowProps = {
  label: string;
  value: string | number | boolean | null | undefined;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div>
      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
        {value ?? "-"}
      </p>
    </div>
  );
}

export default function UserInfoCard() {
  const { user } = useAuthContext();
  console.log("user data", user);
  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <>
      {/* Personal Information Card */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
          Personal Information
        </h4>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          <InfoRow label="Name" value={user.name} />
          <InfoRow label="Email address" value={user.email} />
          <InfoRow label="Phone number" value={user.phoneNumber} />
          <InfoRow label="Birthday" value={user.birthday} />
        </div>
      </div>

      {/* Account Information Card */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mt-6">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
          Account Information
        </h4>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          <InfoRow label="User ID" value={user.id} />
          <InfoRow label="Role" value={user.role} />
          <InfoRow label="Status" value={user.status} />
          <InfoRow
            label="Email Verified"
            value={user.isEmailVerified ? "Yes" : "No"}
          />
          <InfoRow label="Created At" value={user.createdAt} />
          <InfoRow label="Updated At" value={user.updatedAt} />
        </div>
      </div>

      {/* Location Information Card */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mt-6">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
          Location Information
        </h4>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          <InfoRow label="Country" value={user.country} />
          <InfoRow label="City" value={user.city} />
          <InfoRow label="State" value={user.state} />
          <InfoRow label="Region" value={user.region} />
          <InfoRow label="Zip" value={user.zip} />
          <InfoRow label="Address" value={user.address} />
        </div>
      </div>
    </>
  );
}
