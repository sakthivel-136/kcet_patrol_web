'use client';

import React from 'react';

type UserRole = 'Admin' | 'Supervisor' | 'Guard' | 'All';
type UserStatus = 'Active' | 'Inactive' | 'All';

interface UserFilterValues {
  role: UserRole;
  status: UserStatus;
  site: string;
}

interface UserFiltersProps {
  filters: UserFilterValues;
  onFilterChange: (filters: UserFilterValues) => void;
  sites: string[];
}

export default function UserFilters({
  filters,
  onFilterChange,
  sites,
}: UserFiltersProps) {

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    onFilterChange({
      ...filters,
      [name]: value,
    } as UserFilterValues);
  };

  return (
    <div className="glass-panel p-5 rounded-3xl mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div>
          <label
            htmlFor="role"
            className="block text-xs font-bold uppercase tracking-wider text-purple-400 mb-1"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={filters.role}
            onChange={handleChange}
            className="input-field py-2 text-xs bg-white/90 cursor-pointer"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Guard">Guard</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-xs font-bold uppercase tracking-wider text-purple-400 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="input-field py-2 text-xs bg-white/90 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="site"
            className="block text-xs font-bold uppercase tracking-wider text-purple-400 mb-1"
          >
            Campus Site
          </label>
          <select
            id="site"
            name="site"
            value={filters.site}
            onChange={handleChange}
            className="input-field py-2 text-xs bg-white/90 cursor-pointer"
          >
            <option value="All">All Campus Sites</option>
            {sites.map((site) => (
              <option key={site} value={site}>
                {site}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}
