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
    "userId",
    "email",
    "roleName",
    "fullName",
    // "email",
    "createdAt",
    "lastLogin",
    "isVerified",
    "phoneNumber",
    "isActive",
    "isStaff",
    "isAdmin",
    "isSuperuser"
  ],
"tbody": [
    {
      "userId": 1,
      "roleName": "End User",
      "fullName": "Alice User",
      "email": "alice.user@example.com",
      "createdAt": "2025-01-01T10:00:00",
      "lastLogin": "2025-03-15T12:00:00",
      "isVerified": true,
      "phoneNumber": "12345678901",
      "isActive": false,
      "isStaff": true,
      "isAdmin": true,
      "isSuperuser": true
    },
    {
      "userId": 2,
      "roleName": "AI Engineer",
      "fullName": "Bob Engineer",
      "email": "bob.engineer@example.com",
      "createdAt": "2025-01-02T11:00:00",
      "lastLogin": "2025-03-16T13:00:00",
      "isVerified": true,
      "phoneNumber": "12345678902",
      "isActive": true,
      "isStaff": true,
      "isAdmin": false,
      "isSuperuser": false
    },
    {
      "userId": 3,
      "roleName": "Administrator",
      "fullName": "Charlie Admin",
      "email": "charlie.admin@example.com",
      "createdAt": "2025-01-03T12:00:00",
      "lastLogin": "2025-03-17T14:00:00",
      "isVerified": true,
      "phoneNumber": "12345678903",
      "isActive": true,
      "isStaff": true,
      "isAdmin": true,
      "isSuperuser": true
    },
    {
      "userId": 4,
      "roleName": "Finance Team Member",
      "fullName": "Diana Finance",
      "email": "diana.finance@example.com",
      "createdAt": "2025-01-04T13:00:00",
      "lastLogin": "2025-03-18T15:00:00",
      "isVerified": false,
      "phoneNumber": "12345678904",
      "isActive": false,
      "isStaff": false,
      "isAdmin": false,
      "isSuperuser": false
    },
    {
      "userId": 5,
      "roleName": "End User",
      "fullName": "Eve User",
      "email": "eve.user@example.com",
      "createdAt": "2025-01-05T14:00:00",
      "lastLogin": "2025-03-19T16:00:00",
      "isVerified": true,
      "phoneNumber": "12345678905",
      "isActive": true,
      "isStaff": false,
      "isAdmin": false,
      "isSuperuser": false
    },
    {
      "userId": 6,
      "roleName": "AI Engineer",
      "fullName": "Frank Engineer",
      "email": "frank.engineer@example.com",
      "createdAt": "2025-01-06T15:00:00",
      "lastLogin": "2025-03-20T17:00:00",
      "isVerified": false,
      "phoneNumber": "12345678906",
      "isActive": true,
      "isStaff": true,
      "isAdmin": false,
      "isSuperuser": false
    },
    {
      "userId": 7,
      "roleName": "Administrator",
      "fullName": "Grace Admin",
      "email": "grace.admin@example.com",
      "createdAt": "2025-01-07T16:00:00",
      "lastLogin": "2025-03-21T18:00:00",
      "isVerified": true,
      "phoneNumber": "12345678907",
      "isActive": true,
      "isStaff": true,
      "isAdmin": true,
      "isSuperuser": true
    },
    {
      "userId": 8,
      "roleName": "Finance Team Member",
      "fullName": "Hank Finance",
      "email": "hank.finance@example.com",
      "createdAt": "2025-01-08T17:00:00",
      "lastLogin": "2025-03-22T19:00:00",
      "isVerified": false,
      "phoneNumber": "12345678908",
      "isActive": false,
      "isStaff": false,
      "isAdmin": false,
      "isSuperuser": false
    },
    {
      "userId": 9,
      "roleName": "End User",
      "fullName": "Ivy User",
      "email": "ivy.user@example.com",
      "createdAt": "2025-01-09T18:00:00",
      "lastLogin": "2025-03-23T20:00:00",
      "isVerified": true,
      "phoneNumber": "12345678909",
      "isActive": false,
      "isStaff": false,
      "isAdmin": false,
      "isSuperuser": false
    },
    {
      "userId": 10,
      "roleName": "AI Engineer",
      "fullName": "Jack Engineer",
      "email": "jack.engineer@example.com",
      "createdAt": "2025-01-10T19:00:00",
      "lastLogin": "2025-03-24T21:00:00",
      "isVerified": true,
      "phoneNumber": "12345678910",
      "isActive": true,
      "isStaff": true,
      "isAdmin": false,
      "isSuperuser": false
    },
    {
      "userId": 11,
      "roleName": "Administrator",
      "fullName": "Karen Admin",
      "email": "karen.admin@example.com",
      "createdAt": "2025-01-11T20:00:00",
      "lastLogin": "2025-03-25T22:00:00",
      "isVerified": true,
      "phoneNumber": "12345678911",
      "isActive": true,
      "isStaff": true,
      "isAdmin": true,
      "isSuperuser": true
    },
    {
      "userId": 12,
      "roleName": "Finance Team Member",
      "fullName": "Leo Finance",
      "email": "leo.finance@example.com",
      "createdAt": "2025-01-12T21:00:00",
      "lastLogin": "2025-03-26T23:00:00",
      "isVerified": false,
      "phoneNumber": "12345678912",
      "isActive": true,
      "isStaff": false,
      "isAdmin": false,
      "isSuperuser": false
    },
    {
      "userId": 13,
      "roleName": "End User",
      "fullName": "Mia User",
      "email": "mia.user@example.com",
      "createdAt": "2025-01-13T22:00:00",
      "lastLogin": "2025-03-27T00:00:00",
      "isVerified": true,
      "phoneNumber": "12345678913",
      "isActive": true,
      "isStaff": false,
      "isAdmin": false,
      "isSuperuser": false
    },
    {
      "userId": 14,
      "roleName": "AI Engineer",
      "fullName": "Nathan Engineer",
      "email": "nathan.engineer@example.com",
      "createdAt": "2025-01-14T23:00:00",
      "lastLogin": "2025-03-28T01:00:00",
      "isVerified": true,
      "phoneNumber": "12345678914",
      "isActive": true,
      "isStaff": true,
      "isAdmin": false,
      "isSuperuser": false
    },
    {
      "userId": 15,
      "roleName": "Administrator",
      "fullName": "Olivia Admin",
      "email": "olivia.admin@example.com",
      "createdAt": "2025-01-15T00:00:00",
      "lastLogin": "2025-03-29T02:00:00",
      "isVerified": true,
      "phoneNumber": "12345678915",
      "isActive": true,
      "isStaff": true,
      "isAdmin": true,
      "isSuperuser": true
    },
    {
      "userId": 16,
      "roleName": "Finance Team Member",
      "fullName": "Paul Finance",
      "email": "paul.finance@example.com",
      "createdAt": "2025-01-16T01:00:00",
      "lastLogin": "2025-03-30T03:00:00",
      "isVerified": false,
      "phoneNumber": "12345678916",
      "isActive": true,
      "isStaff": false,
      "isAdmin": false,
      "isSuperuser": false
    },
    {
      "userId": 17,
      "roleName": "End User",
      "fullName": "Quinn User",
      "email": "quinn.user@example.com",
      "createdAt": "2025-01-17T02:00:00",
      "lastLogin": "2025-03-31T04:00:00",
      "isVerified": true,
      "phoneNumber": "12345678917",
      "isActive": true,
      "isStaff": false,
      "isAdmin": false,
      "isSuperuser": false
    },
    {
      "userId": 18,
      "roleName": "AI Engineer",
      "fullName": "Rachel Engineer",
      "email": "rachel.engineer@example.com",
      "createdAt": "2025-01-18T03:00:00",
      "lastLogin": "2025-04-01T05:00:00",
      "isVerified": true,
      "phoneNumber": "12345678918",
      "isActive": true,
      "isStaff": true,
      "isAdmin": false,
      "isSuperuser": false
    },
    {
      "userId": 19,
      "roleName": "Administrator",
      "fullName": "Samuel Admin",
      "email": "samuel.admin@example.com",
      "createdAt": "2025-01-19T04:00:00",
      "lastLogin": "2025-04-02T06:00:00",
      "isVerified": true,
      "phoneNumber": "12345678919",
      "isActive": true,
      "isStaff": true,
      "isAdmin": true,
      "isSuperuser": true
    },
    {
      "userId": 20,
      "roleName": "Finance Team Member",
      "fullName": "Tina Finance",
      "email": "tina.finance@example.com",
      "createdAt": "2025-01-20T05:00:00",
      "lastLogin": "2025-04-03T07:00:00",
      "isVerified": false,
      "phoneNumber": "12345678920",
      "isActive": true,
      "isStaff": false,
      "isAdmin": false,
      "isSuperuser": false
    }
  ]
}