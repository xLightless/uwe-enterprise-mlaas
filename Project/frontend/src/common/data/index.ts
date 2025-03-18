/**
 * This file contains dummy data that can be used for testing purposes.
 *
 * Created by Reece Turner, 22036698.
 */

import { Role } from "../interfaces";

export const response = {
  "thead": [
    "ID",
    "User ID",
    "IP Address",
    "Description",
    "Status Code",
    "Generated At",
    "Event Type",
    "Device Info"
  ],
  "tbody": [
    // January 1st
    {
      "ID": 1,
      "User ID": 3,
      "IP Address": "192.168.1.1",
      "Description": "Login attempt",
      "Status Code": 200,
      "Generated At": "2025-01-01T08:30:00Z",
      "Event Type": "Login",
      "Device Info": "Windows 10"
    },
    {
      "ID": 2,
      "User ID": 4,
      "IP Address": "192.168.1.2",
      "Description": "File upload",
      "Status Code": 201,
      "Generated At": "2025-01-01T09:00:00Z",
      "Event Type": "Upload",
      "Device Info": "macOS"
    },
    {
      "ID": 3,
      "User ID": 5,
      "IP Address": "192.168.1.3",
      "Description": "Login attempt",
      "Status Code": 200,
      "Generated At": "2025-01-01T11:00:00Z",
      "Event Type": "Login",
      "Device Info": "Windows 7"
    },
    {
      "ID": 4,
      "User ID": 6,
      "IP Address": "192.168.1.4",
      "Description": "File upload",
      "Status Code": 201,
      "Generated At": "2025-01-01T13:30:00Z",
      "Event Type": "Upload",
      "Device Info": "Linux"
    },
    {
      "ID": 5,
      "User ID": 7,
      "IP Address": "192.168.1.5",
      "Description": "Password change",
      "Status Code": 200,
      "Generated At": "2025-01-01T16:00:00Z",
      "Event Type": "Change Password",
      "Device Info": "iPhone"
    },

    // January 2nd
    {
      "ID": 6,
      "User ID": 8,
      "IP Address": "192.168.1.6",
      "Description": "File download",
      "Status Code": 200,
      "Generated At": "2025-01-02T09:00:00Z",
      "Event Type": "Download",
      "Device Info": "Windows 10"
    },
    {
      "ID": 7,
      "User ID": 9,
      "IP Address": "192.168.1.7",
      "Description": "Account registration",
      "Status Code": 201,
      "Generated At": "2025-01-02T12:00:00Z",
      "Event Type": "Register",
      "Device Info": "macOS"
    },
    {
      "ID": 8,
      "User ID": 10,
      "IP Address": "192.168.1.8",
      "Description": "Login attempt",
      "Status Code": 200,
      "Generated At": "2025-01-02T14:30:00Z",
      "Event Type": "Login",
      "Device Info": "Linux"
    },
    {
      "ID": 9,
      "User ID": 11,
      "IP Address": "192.168.1.9",
      "Description": "File upload",
      "Status Code": 201,
      "Generated At": "2025-01-02T16:00:00Z",
      "Event Type": "Upload",
      "Device Info": "macOS"
    },
    {
      "ID": 10,
      "User ID": 12,
      "IP Address": "192.168.1.10",
      "Description": "Password change",
      "Status Code": 200,
      "Generated At": "2025-01-02T18:30:00Z",
      "Event Type": "Change Password",
      "Device Info": "Windows 7"
    },

    // January 3rd
    {
      "ID": 11,
      "User ID": 13,
      "IP Address": "192.168.1.11",
      "Description": "Login attempt",
      "Status Code": 200,
      "Generated At": "2025-01-03T10:30:00Z",
      "Event Type": "Login",
      "Device Info": "Windows 10"
    },
    {
      "ID": 12,
      "User ID": 14,
      "IP Address": "192.168.1.12",
      "Description": "Account registration",
      "Status Code": 201,
      "Generated At": "2025-01-03T12:00:00Z",
      "Event Type": "Register",
      "Device Info": "Android"
    },
    {
      "ID": 13,
      "User ID": 15,
      "IP Address": "192.168.1.13",
      "Description": "File download",
      "Status Code": 200,
      "Generated At": "2025-01-03T13:30:00Z",
      "Event Type": "Download",
      "Device Info": "macOS"
    },

    // February 1st
    {
      "ID": 14,
      "User ID": 16,
      "IP Address": "192.168.1.14",
      "Description": "File upload",
      "Status Code": 201,
      "Generated At": "2025-02-01T09:00:00Z",
      "Event Type": "Upload",
      "Device Info": "Linux"
    },
    {
      "ID": 15,
      "User ID": 17,
      "IP Address": "192.168.1.15",
      "Description": "Login attempt",
      "Status Code": 200,
      "Generated At": "2025-02-01T10:00:00Z",
      "Event Type": "Login",
      "Device Info": "Windows 7"
    },
    {
      "ID": 16,
      "User ID": 18,
      "IP Address": "192.168.1.16",
      "Description": "Password change",
      "Status Code": 200,
      "Generated At": "2025-02-01T14:30:00Z",
      "Event Type": "Change Password",
      "Device Info": "iPhone"
    },

    // February 3rd
    {
      "ID": 17,
      "User ID": 19,
      "IP Address": "192.168.1.17",
      "Description": "Account registration",
      "Status Code": 201,
      "Generated At": "2025-02-03T08:30:00Z",
      "Event Type": "Register",
      "Device Info": "macOS"
    },
    {
      "ID": 18,
      "User ID": 20,
      "IP Address": "192.168.1.18",
      "Description": "Login attempt",
      "Status Code": 200,
      "Generated At": "2025-02-03T11:00:00Z",
      "Event Type": "Login",
      "Device Info": "Windows 10"
    },
    {
      "ID": 19,
      "User ID": 21,
      "IP Address": "192.168.1.19",
      "Description": "File upload",
      "Status Code": 201,
      "Generated At": "2025-02-03T13:00:00Z",
      "Event Type": "Upload",
      "Device Info": "Linux"
    },
    {
      "ID": 20,
      "User ID": 22,
      "IP Address": "192.168.1.20",
      "Description": "Password change",
      "Status Code": 200,
      "Generated At": "2025-02-03T14:30:00Z",
      "Event Type": "Change Password",
      "Device Info": "Windows 7"
    }
  ]
};

// Dummy data roles
export const rolesResponse: Role[] = [
  {
    roleId: 1,
    roleName: 'End User',
    permissions: [
      { name: 'upload_text_records' },
      { name: 'receive_trained_predictions' },
      { name: 'submit_feedback_prompt' },
      { name: 'view_logs' }
    ]
  },
  {
    roleId: 2,
    roleName: 'AI Engineer',
    permissions: [
      { name: 'upload_new_ml_models' },
      { name: 'crud_models' },
      { name: 'access_end_user_interactions' },
      { name: 'export_anonymized_data' },
      { name: 'view_system_log_metrics' }
    ]
  },
  {
    roleId: 3,
    roleName: 'Administrator',
    permissions: [
      { name: 'manage_user_accounts' },
      { name: 'manage_roles_permissions' },
      { name: 'view_network_activity' },
      { name: 'view_audit_logs' },
      { name: 'manage_audit_log_compliance' }
    ]
  },
  {
    roleId: 4,
    roleName: 'Finance Team Member',
    permissions: [
      { name: 'view_invoices' },
      { name: 'view_billing' },
      { name: 'generate_billing_documents' },
      { name: 'generate_invoices' }
    ]
  }
];

export const usersResponse = {
  "thead": [
    "user_id",
    "role_name",
    "full_name",
    "email",
    "created_at",
    "last_login",
    "is_verified",
    "phone_number",
    "is_active",
    "is_staff",
    "is_admin",
    "is_superuser"
  ],
  "tbody": [
    {
      "user_id": 1,
      "role_name": "End User",
      "full_name": "Alice User",
      "email": "alice.user@example.com",
      "created_at": "2025-01-01T10:00:00",
      "last_login": "2025-03-15T12:00:00",
      "is_verified": true,
      "phone_number": "12345678901",
      "is_active": true,
      "is_staff": false,
      "is_admin": false,
      "is_superuser": false
    },
    {
      "user_id": 2,
      "role_name": "AI Engineer",
      "full_name": "Bob Engineer",
      "email": "bob.engineer@example.com",
      "created_at": "2025-01-02T11:00:00",
      "last_login": "2025-03-16T13:00:00",
      "is_verified": true,
      "phone_number": "12345678902",
      "is_active": true,
      "is_staff": true,
      "is_admin": false,
      "is_superuser": false
    },
    {
      "user_id": 3,
      "role_name": "Administrator",
      "full_name": "Charlie Admin",
      "email": "charlie.admin@example.com",
      "created_at": "2025-01-03T12:00:00",
      "last_login": "2025-03-17T14:00:00",
      "is_verified": true,
      "phone_number": "12345678903",
      "is_active": true,
      "is_staff": true,
      "is_admin": true,
      "is_superuser": true
    },
    {
      "user_id": 4,
      "role_name": "Finance Team Member",
      "full_name": "Diana Finance",
      "email": "diana.finance@example.com",
      "created_at": "2025-01-04T13:00:00",
      "last_login": "2025-03-18T15:00:00",
      "is_verified": false,
      "phone_number": "12345678904",
      "is_active": true,
      "is_staff": false,
      "is_admin": false,
      "is_superuser": false
    },
    {
      "user_id": 5,
      "role_name": "End User",
      "full_name": "Eve User",
      "email": "eve.user@example.com",
      "created_at": "2025-01-05T14:00:00",
      "last_login": "2025-03-19T16:00:00",
      "is_verified": true,
      "phone_number": "12345678905",
      "is_active": true,
      "is_staff": false,
      "is_admin": false,
      "is_superuser": false
    },
    {
      "user_id": 6,
      "role_name": "AI Engineer",
      "full_name": "Frank Engineer",
      "email": "frank.engineer@example.com",
      "created_at": "2025-01-06T15:00:00",
      "last_login": "2025-03-20T17:00:00",
      "is_verified": false,
      "phone_number": "12345678906",
      "is_active": true,
      "is_staff": true,
      "is_admin": false,
      "is_superuser": false
    },
    {
      "user_id": 7,
      "role_name": "Administrator",
      "full_name": "Grace Admin",
      "email": "grace.admin@example.com",
      "created_at": "2025-01-07T16:00:00",
      "last_login": "2025-03-21T18:00:00",
      "is_verified": true,
      "phone_number": "12345678907",
      "is_active": true,
      "is_staff": true,
      "is_admin": true,
      "is_superuser": true
    },
    {
      "user_id": 8,
      "role_name": "Finance Team Member",
      "full_name": "Hank Finance",
      "email": "hank.finance@example.com",
      "created_at": "2025-01-08T17:00:00",
      "last_login": "2025-03-22T19:00:00",
      "is_verified": false,
      "phone_number": "12345678908",
      "is_active": true,
      "is_staff": false,
      "is_admin": false,
      "is_superuser": false
    },
    {
      "user_id": 9,
      "role_name": "End User",
      "full_name": "Ivy User",
      "email": "ivy.user@example.com",
      "created_at": "2025-01-09T18:00:00",
      "last_login": "2025-03-23T20:00:00",
      "is_verified": true,
      "phone_number": "12345678909",
      "is_active": true,
      "is_staff": false,
      "is_admin": false,
      "is_superuser": false
    },
    {
      "user_id": 10,
      "role_name": "AI Engineer",
      "full_name": "Jack Engineer",
      "email": "jack.engineer@example.com",
      "created_at": "2025-01-10T19:00:00",
      "last_login": "2025-03-24T21:00:00",
      "is_verified": true,
      "phone_number": "12345678910",
      "is_active": true,
      "is_staff": true,
      "is_admin": false,
      "is_superuser": false
    }
  ]
}