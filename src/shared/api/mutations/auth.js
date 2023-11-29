import { gql } from 'graphql-tag';

export const registerMutation = gql`
  mutation Register($username: String!, $password: String!, $language: String!) {
    registerUser(data: {username: $username, password: $password, language: $language}) {
      multiTenantCompany {
        id
      }
      username
      language
      firstName
      lastName
    }
  }
`;

export const loginMutation = gql`
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    username
    firstName
    lastName
    language
    multiTenantCompany {
      id
    }
  }
}`;

export const registerCompanyMutation = gql`
  mutation RegisterCompany($country: String!, $name: String!, $language: String!, $phoneNumber: String!) {
    registerMyMultiTenantCompany(data: {
      country: $country,
      name: $name,
      language: $language,
      phoneNumber: $phoneNumber
    }) {
      id
      name
    }
  }
`;