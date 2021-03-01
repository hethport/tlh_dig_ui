import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  transliterationResult?: Maybe<Array<TransliterationLine>>;
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
  MiddleBabylonianScript = 'MiddleBabylonianScript',
  MiddleAssyrianScript = 'MiddleAssyrianScript',
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

export type TransliterationLine = {
  __typename?: 'TransliterationLine';
  lineIndex: Scalars['Int'];
  transliterationLineInput: Scalars['String'];
  result?: Maybe<TransliterationLineResult>;
};

export type TransliterationLineResult = {
  __typename?: 'TransliterationLineResult';
  lineNumber: Scalars['Int'];
  isAbsolute: Scalars['Boolean'];
  words: Array<TransliterationWord>;
};

export type TransliterationWord = {
  __typename?: 'TransliterationWord';
  content: Array<TransliterationWordContentUnion>;
};

export type TransliterationWordContentUnion = StringContent | DamageContent | CorrectionContent | NumeralContent | MarkContent;

export type StringContent = {
  __typename?: 'StringContent';
  type: StringContentTypeEnum;
  content: Scalars['String'];
};

export enum StringContentTypeEnum {
  Hittite = 'Hittite',
  Akadogramm = 'Akadogramm',
  Determinativ = 'Determinativ',
  MaterLectionis = 'MaterLectionis',
  Sumerogramm = 'Sumerogramm'
}

export type DamageContent = {
  __typename?: 'DamageContent';
  type: DamageType;
};

export enum DamageType {
  DeletionStart = 'DeletionStart',
  DeletionEnd = 'DeletionEnd',
  LesionStart = 'LesionStart',
  LesionEnd = 'LesionEnd',
  Rasure = 'Rasure',
  SurplusStart = 'SurplusStart',
  SurplusEnd = 'SurplusEnd',
  SupplementStart = 'SupplementStart',
  SupplementEnd = 'SupplementEnd',
  UnknownDamageStart = 'UnknownDamageStart',
  UnknownDamageEnd = 'UnknownDamageEnd'
}

export type CorrectionContent = {
  __typename?: 'CorrectionContent';
  type: CorrectionType;
};

export enum CorrectionType {
  UnsureCorrection = 'UnsureCorrection',
  MaybeUnsureCorrection = 'MaybeUnsureCorrection',
  SureCorrection = 'SureCorrection',
  SicCorrection = 'SicCorrection',
  Ellipsis = 'Ellipsis',
  ParagraphEnd = 'ParagraphEnd',
  DoubleParagraphEnd = 'DoubleParagraphEnd'
}

export type NumeralContent = {
  __typename?: 'NumeralContent';
  isSubscript: Scalars['Boolean'];
  content: Scalars['String'];
};

export type MarkContent = {
  __typename?: 'MarkContent';
  type: MarkType;
  content: Scalars['String'];
};

export enum MarkType {
  Sign = 'Sign',
  TextGap = 'TextGap',
  FootNote = 'FootNote',
  Colon = 'Colon',
  Arbitrary = 'Arbitrary'
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
  mainIdentifier: Scalars['String'];
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
  updateTransliteration: Scalars['Boolean'];
};


export type ManuscriptMutationsUpdateTransliterationArgs = {
  values: Array<TransliterationLineInput>;
};

export type TransliterationLineInput = {
  lineIndex: Scalars['Int'];
  transliterationLineInput: Scalars['String'];
  result?: Maybe<TransliterationLineResultInput>;
};

export type TransliterationLineResultInput = {
  lineNumber: Scalars['Int'];
  isAbsolute: Scalars['Boolean'];
  words: Array<TransliterationWordInput>;
};

export type TransliterationWordInput = {
  content: Array<Maybe<TransliterationWordContentInputUnion>>;
};

export type TransliterationWordContentInputUnion = {
  stringContent?: Maybe<StringContentInput>;
  numeralContent?: Maybe<NumeralContentInput>;
  damageContent?: Maybe<DamageType>;
  correctionContent?: Maybe<CorrectionType>;
  markContent?: Maybe<MarkContentInput>;
};

export type StringContentInput = {
  type: StringContentTypeEnum;
  content: Scalars['String'];
};

export type NumeralContentInput = {
  isSubscript: Scalars['Boolean'];
  content: Scalars['String'];
};

export type MarkContentInput = {
  type: MarkType;
  content: Scalars['String'];
};

export enum ManuscriptSide {
  NotIdentifiable = 'NotIdentifiable',
  Obverse = 'Obverse',
  Reverse = 'Reverse',
  LowerEdge = 'LowerEdge',
  UpperEdge = 'UpperEdge',
  LeftEdge = 'LeftEdge',
  RightEdge = 'RightEdge',
  SideA = 'SideA',
  SideB = 'SideB',
  InscriptionNumber = 'InscriptionNumber',
  SealInscription = 'SealInscription'
}

export enum ManuscriptColumn {
  None = 'None',
  I = 'I',
  Ii = 'II',
  Iii = 'III',
  Iv = 'IV',
  V = 'V',
  Vi = 'VI',
  Vii = 'VII',
  Viii = 'VIII',
  Ix = 'IX',
  X = 'X',
  Xi = 'XI',
  Xii = 'XII',
  LeftColumn = 'LeftColumn',
  MiddleColumn = 'MiddleColumn',
  RightColumn = 'RightColumn',
  ColumnDivider = 'ColumnDivider'
}

export enum ManuscriptColumnModifier {
  None = 'None',
  Slash = 'Slash',
  SlashQuestion = 'SlashQuestion'
}

export enum ManuscriptLanguage {
  Hittite = 'Hittite',
  Luwian = 'Luwian',
  Palaic = 'Palaic',
  Hattic = 'Hattic',
  Hurrian = 'Hurrian',
  Akkadian = 'Akkadian',
  Sumerian = 'Sumerian',
  NotIdentifiable = 'NotIdentifiable'
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
  manuscriptMetaData?: Maybe<ManuscriptMetaDataInput>;
}>;


export type CreateManuscriptMutation = (
  { __typename?: 'Mutation' }
  & { me?: Maybe<(
    { __typename?: 'LoggedInUserMutations' }
    & Pick<LoggedInUserMutations, 'createManuscript'>
  )> }
);

type TransliterationWordContent_StringContent_Fragment = (
  { __typename?: 'StringContent' }
  & Pick<StringContent, 'content'>
  & { stringContentType: StringContent['type'] }
);

type TransliterationWordContent_DamageContent_Fragment = (
  { __typename?: 'DamageContent' }
  & { damageType: DamageContent['type'] }
);

type TransliterationWordContent_CorrectionContent_Fragment = (
  { __typename?: 'CorrectionContent' }
  & { correctionType: CorrectionContent['type'] }
);

type TransliterationWordContent_NumeralContent_Fragment = (
  { __typename?: 'NumeralContent' }
  & Pick<NumeralContent, 'content' | 'isSubscript'>
);

type TransliterationWordContent_MarkContent_Fragment = { __typename?: 'MarkContent' };

export type TransliterationWordContentFragment = TransliterationWordContent_StringContent_Fragment | TransliterationWordContent_DamageContent_Fragment | TransliterationWordContent_CorrectionContent_Fragment | TransliterationWordContent_NumeralContent_Fragment | TransliterationWordContent_MarkContent_Fragment;

export type TransliterationLineFragment = (
  { __typename?: 'TransliterationLine' }
  & Pick<TransliterationLine, 'lineIndex' | 'transliterationLineInput'>
  & { result?: Maybe<(
    { __typename?: 'TransliterationLineResult' }
    & Pick<TransliterationLineResult, 'isAbsolute' | 'lineNumber'>
    & { words: Array<(
      { __typename?: 'TransliterationWord' }
      & { content: Array<(
        { __typename?: 'StringContent' }
        & TransliterationWordContent_StringContent_Fragment
      ) | (
        { __typename?: 'DamageContent' }
        & TransliterationWordContent_DamageContent_Fragment
      ) | (
        { __typename?: 'CorrectionContent' }
        & TransliterationWordContent_CorrectionContent_Fragment
      ) | (
        { __typename?: 'NumeralContent' }
        & TransliterationWordContent_NumeralContent_Fragment
      ) | (
        { __typename?: 'MarkContent' }
        & TransliterationWordContent_MarkContent_Fragment
      )> }
    )> }
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
  )>, transliterationResult?: Maybe<Array<(
    { __typename?: 'TransliterationLine' }
    & TransliterationLineFragment
  )>> }
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

export type UploadTransliterationMutationVariables = Exact<{
  mainIdentifier: Scalars['String'];
  values: Array<TransliterationLineInput> | TransliterationLineInput;
}>;


export type UploadTransliterationMutation = (
  { __typename?: 'Mutation' }
  & { me?: Maybe<(
    { __typename?: 'LoggedInUserMutations' }
    & { manuscript?: Maybe<(
      { __typename?: 'ManuscriptMutations' }
      & Pick<ManuscriptMutations, 'updateTransliteration'>
    )> }
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
export const TransliterationWordContentFragmentDoc = gql`
    fragment TransliterationWordContent on TransliterationWordContentUnion {
  ... on CorrectionContent {
    correctionType: type
  }
  ... on DamageContent {
    damageType: type
  }
  ... on StringContent {
    stringContentType: type
    content
  }
  ... on NumeralContent {
    content
    isSubscript
  }
}
    `;
export const TransliterationLineFragmentDoc = gql`
    fragment TransliterationLine on TransliterationLine {
  lineIndex
  transliterationLineInput
  result {
    isAbsolute
    lineNumber
    words {
      content {
        ...TransliterationWordContent
      }
    }
  }
}
    ${TransliterationWordContentFragmentDoc}`;
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
  transliterationResult {
    ...TransliterationLine
  }
}
    ${ManuscriptIdentifierFragmentDoc}
${TransliterationLineFragmentDoc}`;
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
    mutation CreateManuscript($manuscriptMetaData: ManuscriptMetaDataInput) {
  me {
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
export function useManuscriptQuery(baseOptions: Apollo.QueryHookOptions<ManuscriptQuery, ManuscriptQueryVariables>) {
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
export function useUploadPicturesQuery(baseOptions: Apollo.QueryHookOptions<UploadPicturesQuery, UploadPicturesQueryVariables>) {
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
export function useTransliterationInputQuery(baseOptions: Apollo.QueryHookOptions<TransliterationInputQuery, TransliterationInputQueryVariables>) {
        return Apollo.useQuery<TransliterationInputQuery, TransliterationInputQueryVariables>(TransliterationInputDocument, baseOptions);
      }
export function useTransliterationInputLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransliterationInputQuery, TransliterationInputQueryVariables>) {
          return Apollo.useLazyQuery<TransliterationInputQuery, TransliterationInputQueryVariables>(TransliterationInputDocument, baseOptions);
        }
export type TransliterationInputQueryHookResult = ReturnType<typeof useTransliterationInputQuery>;
export type TransliterationInputLazyQueryHookResult = ReturnType<typeof useTransliterationInputLazyQuery>;
export type TransliterationInputQueryResult = Apollo.QueryResult<TransliterationInputQuery, TransliterationInputQueryVariables>;
export const UploadTransliterationDocument = gql`
    mutation uploadTransliteration($mainIdentifier: String!, $values: [TransliterationLineInput!]!) {
  me {
    manuscript(mainIdentifier: $mainIdentifier) {
      updateTransliteration(values: $values)
    }
  }
}
    `;
export type UploadTransliterationMutationFn = Apollo.MutationFunction<UploadTransliterationMutation, UploadTransliterationMutationVariables>;

/**
 * __useUploadTransliterationMutation__
 *
 * To run a mutation, you first call `useUploadTransliterationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadTransliterationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadTransliterationMutation, { data, loading, error }] = useUploadTransliterationMutation({
 *   variables: {
 *      mainIdentifier: // value for 'mainIdentifier'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useUploadTransliterationMutation(baseOptions?: Apollo.MutationHookOptions<UploadTransliterationMutation, UploadTransliterationMutationVariables>) {
        return Apollo.useMutation<UploadTransliterationMutation, UploadTransliterationMutationVariables>(UploadTransliterationDocument, baseOptions);
      }
export type UploadTransliterationMutationHookResult = ReturnType<typeof useUploadTransliterationMutation>;
export type UploadTransliterationMutationResult = Apollo.MutationResult<UploadTransliterationMutation>;
export type UploadTransliterationMutationOptions = Apollo.BaseMutationOptions<UploadTransliterationMutation, UploadTransliterationMutationVariables>;