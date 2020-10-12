import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  allManuscripts: Array<ManuscriptMetaData>;
  manuscript?: Maybe<ManuscriptMetaData>;
};


export type QueryManuscriptArgs = {
  mainIdentifier: Scalars['String'];
};

export type ManuscriptMetaData = {
  __typename?: 'ManuscriptMetaData';
  mainIdentifier: ManuscriptIdentifier;
  provenance?: Maybe<Scalars['String']>;
  cthClassification?: Maybe<Scalars['Int']>;
  bibliography?: Maybe<Scalars['String']>;
  creatorUsername: Scalars['String'];
  palaeographicClassification: PalaeographicClassification;
  palaeographicClassificationSure: Scalars['Boolean'];
  status?: Maybe<ManuscriptStatus>;
  otherIdentifiers: Array<ManuscriptIdentifier>;
  pictureUrls: Array<Scalars['String']>;
};

export type ManuscriptIdentifier = {
  __typename?: 'ManuscriptIdentifier';
  type: ManuscriptIdentifierType;
  identifier: Scalars['String'];
};

export enum ManuscriptIdentifierType {
  ExcavationNumber = 'ExcavationNumber',
  CollectionNumber = 'CollectionNumber',
  PublicationShortReference = 'PublicationShortReference'
}

export enum PalaeographicClassification {
  OldScript = 'OldScript',
  MiddleScript = 'MiddleScript',
  NewScript = 'NewScript',
  LateNewScript = 'LateNewScript',
  OldAssyrianScript = 'OldAssyrianScript',
  MiddleAssyrianScript = 'MiddleAssyrianScript',
  MiddleBabylonianScript = 'MiddleBabylonianScript',
  AssyroMittanianScript = 'AssyroMittanianScript',
  Unclassified = 'Unclassified'
}

export enum ManuscriptStatus {
  InCreation = 'InCreation',
  Created = 'Created',
  Reviewed = 'Reviewed',
  ReviewMerged = 'ReviewMerged',
  ExecutiveReviewed = 'ExecutiveReviewed',
  ExecutiveReviewMerged = 'ExecutiveReviewMerged',
  Approved = 'Approved'
}

export type Mutation = {
  __typename?: 'Mutation';
  register?: Maybe<Scalars['String']>;
  login?: Maybe<LoggedInUser>;
  me?: Maybe<LoggedInUserMutations>;
};


export type MutationRegisterArgs = {
  userInput: UserInput;
};


export type MutationLoginArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};


export type MutationMeArgs = {
  jwt: Scalars['String'];
};

export type UserInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  passwordRepeat: Scalars['String'];
  name: Scalars['String'];
  affiliation?: Maybe<Scalars['String']>;
  email: Scalars['String'];
};

export type LoggedInUser = {
  __typename?: 'LoggedInUser';
  username: Scalars['String'];
  name: Scalars['String'];
  affiliation?: Maybe<Scalars['String']>;
  jwt: Scalars['String'];
};

export type LoggedInUserMutations = {
  __typename?: 'LoggedInUserMutations';
  createManuscript?: Maybe<Scalars['String']>;
};


export type LoggedInUserMutationsCreateManuscriptArgs = {
  values?: Maybe<ManuscriptMetaDataInput>;
};

export type ManuscriptMetaDataInput = {
  mainIdentifier: ManuscriptIdentifierInput;
  otherIdentifiers?: Maybe<Array<Maybe<ManuscriptIdentifierInput>>>;
  palaeographicClassification: PalaeographicClassification;
  palaeographicClassificationSure: Scalars['Boolean'];
  provenance?: Maybe<Scalars['String']>;
  cthClassification?: Maybe<Scalars['Int']>;
  bibliography?: Maybe<Scalars['String']>;
};

export type ManuscriptIdentifierInput = {
  identifierType: ManuscriptIdentifierType;
  identifier: Scalars['String'];
};

export type IndexQueryVariables = Exact<{ [key: string]: never; }>;


export type IndexQuery = (
  { __typename?: 'Query' }
  & { allManuscripts: Array<(
    { __typename?: 'ManuscriptMetaData' }
    & { mainIdentifier: (
      { __typename?: 'ManuscriptIdentifier' }
      & Pick<ManuscriptIdentifier, 'type' | 'identifier'>
    ) }
  )> }
);

export type RegisterMutationVariables = Exact<{
  userInput: UserInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'register'>
);

export type LoggedInUserFragment = (
  { __typename?: 'LoggedInUser' }
  & Pick<LoggedInUser, 'username' | 'name' | 'jwt' | 'affiliation'>
);

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login?: Maybe<(
    { __typename?: 'LoggedInUser' }
    & LoggedInUserFragment
  )> }
);

export const LoggedInUserFragmentDoc = gql`
    fragment LoggedInUser on LoggedInUser {
  username
  name
  jwt
  affiliation
}
    `;
export const IndexDocument = gql`
    query Index {
  allManuscripts {
    mainIdentifier {
      type
      identifier
    }
  }
}
    `;

/**
 * __useIndexQuery__
 *
 * To run a query within a React component, call `useIndexQuery` and pass it any options that fit your needs.
 * When your component renders, `useIndexQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIndexQuery({
 *   variables: {
 *   },
 * });
 */
export function useIndexQuery(baseOptions?: Apollo.QueryHookOptions<IndexQuery, IndexQueryVariables>) {
        return Apollo.useQuery<IndexQuery, IndexQueryVariables>(IndexDocument, baseOptions);
      }
export function useIndexLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IndexQuery, IndexQueryVariables>) {
          return Apollo.useLazyQuery<IndexQuery, IndexQueryVariables>(IndexDocument, baseOptions);
        }
export type IndexQueryHookResult = ReturnType<typeof useIndexQuery>;
export type IndexLazyQueryHookResult = ReturnType<typeof useIndexLazyQuery>;
export type IndexQueryResult = Apollo.QueryResult<IndexQuery, IndexQueryVariables>;
export const RegisterDocument = gql`
    mutation Register($userInput: UserInput!) {
  register(userInput: $userInput)
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      userInput: // value for 'userInput'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    ...LoggedInUser
  }
}
    ${LoggedInUserFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;

      export interface IntrospectionResultData {
        __schema: {
          types: {
            kind: string;
            name: string;
            possibleTypes: {
              name: string;
            }[];
          }[];
        };
      }
      const result: IntrospectionResultData = {
  "__schema": {
    "types": []
  }
};
      export default result;
    