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
  manuscript?: Maybe<ManuscriptMutations>;
};


export type LoggedInUserMutationsCreateManuscriptArgs = {
  values?: Maybe<ManuscriptMetaDataInput>;
};


export type LoggedInUserMutationsManuscriptArgs = {
  id?: Maybe<Scalars['Int']>;
};

export type ManuscriptMetaDataInput = {
  mainIdentifier: ManuscriptIdentifierInput;
  otherIdentifiers: Array<ManuscriptIdentifierInput>;
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

export type ManuscriptMutations = {
  __typename?: 'ManuscriptMutations';
  updateTransliteration?: Maybe<Scalars['String']>;
};


export type ManuscriptMutationsUpdateTransliterationArgs = {
  values: Array<TransliterationTextLineInput>;
};

export type TransliterationTextLineInput = {
  lineNumber: Scalars['Int'];
  isAbsolute: Scalars['Boolean'];
  content: Array<TransliterationTextLineContentUnion>;
};

export type TransliterationTextLineContentUnion = {
  stringContent?: Maybe<StringContentInput>;
  damageContent?: Maybe<DamageInput>;
  correctionContent?: Maybe<CorrectionType>;
};

export type StringContentInput = {
  type: StringContentTypeEnum;
  content: Scalars['String'];
};

export enum StringContentTypeEnum {
  Akadogramm = 'Akadogramm',
  Determinativ = 'Determinativ',
  MaterLectionis = 'MaterLectionis',
  Sumerogramm = 'Sumerogramm'
}

export type DamageInput = {
  type: DamageTypeEnum;
  position: DamagePositionEnum;
};

export enum DamageTypeEnum {
  Deletion = 'Deletion',
  Lesion = 'Lesion',
  Rasure = 'Rasure',
  Surplus = 'Surplus',
  Supplement = 'Supplement',
  UnknownDamage = 'UnknownDamage'
}

export enum DamagePositionEnum {
  Start = 'Start',
  End = 'End'
}

export enum CorrectionType {
  UnsureCorrection = 'UnsureCorrection',
  MaybeUnsureCorrection = 'MaybeUnsureCorrection',
  SureCorrection = 'SureCorrection',
  SicCorrection = 'SicCorrection',
  Ellipsis = 'Ellipsis',
  ParagraphEnd = 'ParagraphEnd'
}

export type ManuscriptIdentifierFragment = (
  { __typename?: 'ManuscriptIdentifier' }
  & Pick<ManuscriptIdentifier, 'type' | 'identifier'>
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

export type ManuscriptBasicDataFragment = (
  { __typename?: 'ManuscriptMetaData' }
  & Pick<ManuscriptMetaData, 'status' | 'creatorUsername'>
  & { mainIdentifier: (
    { __typename?: 'ManuscriptIdentifier' }
    & ManuscriptIdentifierFragment
  ) }
);

export type IndexQueryVariables = Exact<{ [key: string]: never; }>;


export type IndexQuery = (
  { __typename?: 'Query' }
  & { allManuscripts: Array<(
    { __typename?: 'ManuscriptMetaData' }
    & ManuscriptBasicDataFragment
  )> }
);

export type CreateManuscriptMutationVariables = Exact<{
  jwt: Scalars['String'];
  manuscriptMetaData?: Maybe<ManuscriptMetaDataInput>;
}>;


export type CreateManuscriptMutation = (
  { __typename?: 'Mutation' }
  & { me?: Maybe<(
    { __typename?: 'LoggedInUserMutations' }
    & Pick<LoggedInUserMutations, 'createManuscript'>
  )> }
);

export type ManuscriptMetaDataFragment = (
  { __typename?: 'ManuscriptMetaData' }
  & Pick<ManuscriptMetaData, 'bibliography' | 'cthClassification' | 'palaeographicClassification' | 'palaeographicClassificationSure' | 'provenance' | 'creatorUsername' | 'pictureUrls'>
  & { mainIdentifier: (
    { __typename?: 'ManuscriptIdentifier' }
    & ManuscriptIdentifierFragment
  ), otherIdentifiers: Array<(
    { __typename?: 'ManuscriptIdentifier' }
    & ManuscriptIdentifierFragment
  )> }
);

export type ManuscriptQueryVariables = Exact<{
  mainIdentifier: Scalars['String'];
}>;


export type ManuscriptQuery = (
  { __typename?: 'Query' }
  & { manuscript?: Maybe<(
    { __typename?: 'ManuscriptMetaData' }
    & ManuscriptMetaDataFragment
  )> }
);

export type ManuscriptIdentWithCreatorFragment = (
  { __typename?: 'ManuscriptMetaData' }
  & Pick<ManuscriptMetaData, 'pictureUrls' | 'creatorUsername'>
  & { mainIdentifier: (
    { __typename?: 'ManuscriptIdentifier' }
    & ManuscriptIdentifierFragment
  ) }
);

export type UploadPicturesQueryVariables = Exact<{
  mainIdentifier: Scalars['String'];
}>;


export type UploadPicturesQuery = (
  { __typename?: 'Query' }
  & { manuscript?: Maybe<(
    { __typename?: 'ManuscriptMetaData' }
    & ManuscriptIdentWithCreatorFragment
  )> }
);

export type TransliterationInputQueryVariables = Exact<{
  mainIdentifier: Scalars['String'];
}>;


export type TransliterationInputQuery = (
  { __typename?: 'Query' }
  & { manuscript?: Maybe<(
    { __typename?: 'ManuscriptMetaData' }
    & { mainIdentifier: (
      { __typename?: 'ManuscriptIdentifier' }
      & ManuscriptIdentifierFragment
    ) }
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
export const ManuscriptIdentifierFragmentDoc = gql`
    fragment ManuscriptIdentifier on ManuscriptIdentifier {
  type
  identifier
}
    `;
export const ManuscriptBasicDataFragmentDoc = gql`
    fragment ManuscriptBasicData on ManuscriptMetaData {
  mainIdentifier {
    ...ManuscriptIdentifier
  }
  status
  creatorUsername
}
    ${ManuscriptIdentifierFragmentDoc}`;
export const ManuscriptMetaDataFragmentDoc = gql`
    fragment ManuscriptMetaData on ManuscriptMetaData {
  mainIdentifier {
    ...ManuscriptIdentifier
  }
  otherIdentifiers {
    ...ManuscriptIdentifier
  }
  bibliography
  cthClassification
  palaeographicClassification
  palaeographicClassificationSure
  provenance
  creatorUsername
  pictureUrls
}
    ${ManuscriptIdentifierFragmentDoc}`;
export const ManuscriptIdentWithCreatorFragmentDoc = gql`
    fragment ManuscriptIdentWithCreator on ManuscriptMetaData {
  mainIdentifier {
    ...ManuscriptIdentifier
  }
  pictureUrls
  creatorUsername
}
    ${ManuscriptIdentifierFragmentDoc}`;
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
export const IndexDocument = gql`
    query Index {
  allManuscripts {
    ...ManuscriptBasicData
  }
}
    ${ManuscriptBasicDataFragmentDoc}`;

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
export const CreateManuscriptDocument = gql`
    mutation CreateManuscript($jwt: String!, $manuscriptMetaData: ManuscriptMetaDataInput) {
  me(jwt: $jwt) {
    createManuscript(values: $manuscriptMetaData)
  }
}
    `;
export type CreateManuscriptMutationFn = Apollo.MutationFunction<CreateManuscriptMutation, CreateManuscriptMutationVariables>;

/**
 * __useCreateManuscriptMutation__
 *
 * To run a mutation, you first call `useCreateManuscriptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateManuscriptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createManuscriptMutation, { data, loading, error }] = useCreateManuscriptMutation({
 *   variables: {
 *      jwt: // value for 'jwt'
 *      manuscriptMetaData: // value for 'manuscriptMetaData'
 *   },
 * });
 */
export function useCreateManuscriptMutation(baseOptions?: Apollo.MutationHookOptions<CreateManuscriptMutation, CreateManuscriptMutationVariables>) {
        return Apollo.useMutation<CreateManuscriptMutation, CreateManuscriptMutationVariables>(CreateManuscriptDocument, baseOptions);
      }
export type CreateManuscriptMutationHookResult = ReturnType<typeof useCreateManuscriptMutation>;
export type CreateManuscriptMutationResult = Apollo.MutationResult<CreateManuscriptMutation>;
export type CreateManuscriptMutationOptions = Apollo.BaseMutationOptions<CreateManuscriptMutation, CreateManuscriptMutationVariables>;
export const ManuscriptDocument = gql`
    query Manuscript($mainIdentifier: String!) {
  manuscript(mainIdentifier: $mainIdentifier) {
    ...ManuscriptMetaData
  }
}
    ${ManuscriptMetaDataFragmentDoc}`;

/**
 * __useManuscriptQuery__
 *
 * To run a query within a React component, call `useManuscriptQuery` and pass it any options that fit your needs.
 * When your component renders, `useManuscriptQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useManuscriptQuery({
 *   variables: {
 *      mainIdentifier: // value for 'mainIdentifier'
 *   },
 * });
 */
export function useManuscriptQuery(baseOptions?: Apollo.QueryHookOptions<ManuscriptQuery, ManuscriptQueryVariables>) {
        return Apollo.useQuery<ManuscriptQuery, ManuscriptQueryVariables>(ManuscriptDocument, baseOptions);
      }
export function useManuscriptLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ManuscriptQuery, ManuscriptQueryVariables>) {
          return Apollo.useLazyQuery<ManuscriptQuery, ManuscriptQueryVariables>(ManuscriptDocument, baseOptions);
        }
export type ManuscriptQueryHookResult = ReturnType<typeof useManuscriptQuery>;
export type ManuscriptLazyQueryHookResult = ReturnType<typeof useManuscriptLazyQuery>;
export type ManuscriptQueryResult = Apollo.QueryResult<ManuscriptQuery, ManuscriptQueryVariables>;
export const UploadPicturesDocument = gql`
    query UploadPictures($mainIdentifier: String!) {
  manuscript(mainIdentifier: $mainIdentifier) {
    ...ManuscriptIdentWithCreator
  }
}
    ${ManuscriptIdentWithCreatorFragmentDoc}`;

/**
 * __useUploadPicturesQuery__
 *
 * To run a query within a React component, call `useUploadPicturesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUploadPicturesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUploadPicturesQuery({
 *   variables: {
 *      mainIdentifier: // value for 'mainIdentifier'
 *   },
 * });
 */
export function useUploadPicturesQuery(baseOptions?: Apollo.QueryHookOptions<UploadPicturesQuery, UploadPicturesQueryVariables>) {
        return Apollo.useQuery<UploadPicturesQuery, UploadPicturesQueryVariables>(UploadPicturesDocument, baseOptions);
      }
export function useUploadPicturesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UploadPicturesQuery, UploadPicturesQueryVariables>) {
          return Apollo.useLazyQuery<UploadPicturesQuery, UploadPicturesQueryVariables>(UploadPicturesDocument, baseOptions);
        }
export type UploadPicturesQueryHookResult = ReturnType<typeof useUploadPicturesQuery>;
export type UploadPicturesLazyQueryHookResult = ReturnType<typeof useUploadPicturesLazyQuery>;
export type UploadPicturesQueryResult = Apollo.QueryResult<UploadPicturesQuery, UploadPicturesQueryVariables>;
export const TransliterationInputDocument = gql`
    query TransliterationInput($mainIdentifier: String!) {
  manuscript(mainIdentifier: $mainIdentifier) {
    mainIdentifier {
      ...ManuscriptIdentifier
    }
  }
}
    ${ManuscriptIdentifierFragmentDoc}`;

/**
 * __useTransliterationInputQuery__
 *
 * To run a query within a React component, call `useTransliterationInputQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransliterationInputQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransliterationInputQuery({
 *   variables: {
 *      mainIdentifier: // value for 'mainIdentifier'
 *   },
 * });
 */
export function useTransliterationInputQuery(baseOptions?: Apollo.QueryHookOptions<TransliterationInputQuery, TransliterationInputQueryVariables>) {
        return Apollo.useQuery<TransliterationInputQuery, TransliterationInputQueryVariables>(TransliterationInputDocument, baseOptions);
      }
export function useTransliterationInputLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransliterationInputQuery, TransliterationInputQueryVariables>) {
          return Apollo.useLazyQuery<TransliterationInputQuery, TransliterationInputQueryVariables>(TransliterationInputDocument, baseOptions);
        }
export type TransliterationInputQueryHookResult = ReturnType<typeof useTransliterationInputQuery>;
export type TransliterationInputLazyQueryHookResult = ReturnType<typeof useTransliterationInputLazyQuery>;
export type TransliterationInputQueryResult = Apollo.QueryResult<TransliterationInputQuery, TransliterationInputQueryVariables>;

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
    