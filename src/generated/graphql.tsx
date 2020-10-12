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
    