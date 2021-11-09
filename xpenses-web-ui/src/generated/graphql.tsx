import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  sync_id?: Maybe<Scalars['Int']>;
  sort_order?: Maybe<Scalars['Int']>;
  state?: Maybe<Scalars['Int']>;
  typ?: Maybe<Scalars['Int']>;
  parent_id?: Maybe<Scalars['Int']>;
  parent?: Maybe<Category>;
  children: Array<Maybe<Category>>;
  modified?: Maybe<Scalars['DateTime']>;
};

export type Expense = {
  __typename?: 'Expense';
  tran_date?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  amount: Scalars['Int'];
  state: Scalars['Int'];
  typ?: Maybe<Scalars['Int']>;
  date_created?: Maybe<Scalars['DateTime']>;
  category_id: Scalars['Int'];
  category?: Maybe<Category>;
  user_id: Scalars['Int'];
  user?: Maybe<User>;
  wallet_id: Scalars['Int'];
  wallet?: Maybe<Wallet>;
};

export type Query = {
  __typename?: 'Query';
  user?: Maybe<User>;
  wallet?: Maybe<Wallet>;
  category?: Maybe<Category>;
  categories: Array<Maybe<Category>>;
  smsregexp?: Maybe<SmsRegExp>;
  smsregexps: Array<Maybe<SmsRegExp>>;
  expense?: Maybe<Expense>;
  expenses: Array<Maybe<Expense>>;
};


export type QueryUserArgs = {
  id?: Maybe<Scalars['Int']>;
  token?: Maybe<Scalars['String']>;
};


export type QueryWalletArgs = {
  id: Scalars['Int'];
};


export type QueryCategoryArgs = {
  id: Scalars['Int'];
};


export type QueryCategoriesArgs = {
  group_code: Scalars['Int'];
  typ?: Maybe<Scalars['Int']>;
};


export type QuerySmsregexpArgs = {
  id: Scalars['Int'];
};


export type QuerySmsregexpsArgs = {
  user_id?: Maybe<Scalars['Int']>;
};


export type QueryExpenseArgs = {
  id: Scalars['Int'];
};


export type QueryExpensesArgs = {
  group_code: Scalars['Int'];
  date_from: Scalars['DateTime'];
  date_to: Scalars['DateTime'];
  typ?: Maybe<Scalars['Int']>;
};

export type SmsRegExp = {
  __typename?: 'SmsRegExp';
  id: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  category_id: Scalars['Int'];
  category: Category;
  amount: Scalars['Int'];
  state: Scalars['Int'];
  sync_id?: Maybe<Scalars['Int']>;
  user_id: Scalars['Int'];
  user: User;
  wallet_id: Scalars['Int'];
  wallet: Wallet;
  regex: Scalars['String'];
  date_created?: Maybe<Scalars['DateTime']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  short_name?: Maybe<Scalars['String']>;
  sync_id?: Maybe<Scalars['Int']>;
  auth_user_id?: Maybe<Scalars['Int']>;
  state?: Maybe<Scalars['Int']>;
  date_created?: Maybe<Scalars['DateTime']>;
  smsregexps: Array<Maybe<SmsRegExp>>;
  group_code?: Maybe<Scalars['Int']>;
};

export type Wallet = {
  __typename?: 'Wallet';
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  short_name?: Maybe<Scalars['String']>;
  sync_id?: Maybe<Scalars['Int']>;
  sort_order?: Maybe<Scalars['Int']>;
  state?: Maybe<Scalars['Int']>;
  amount?: Maybe<Scalars['Int']>;
  amount_date?: Maybe<Scalars['DateTime']>;
  modified?: Maybe<Scalars['DateTime']>;
};

export type CategoriesQueryVariables = Exact<{
  groupCode: Scalars['Int'];
  typ?: Maybe<Scalars['Int']>;
}>;


export type CategoriesQuery = { __typename?: 'Query', categories: Array<Maybe<{ __typename?: 'Category', id: number, name?: Maybe<string>, parent_id?: Maybe<number>, parent?: Maybe<{ __typename?: 'Category', id: number, name?: Maybe<string> }> }>> };

export type ExpensesForSummaryQueryVariables = Exact<{
  groupCode: Scalars['Int'];
  dateFrom: Scalars['DateTime'];
  dateTo: Scalars['DateTime'];
  type?: Maybe<Scalars['Int']>;
}>;


export type ExpensesForSummaryQuery = { __typename?: 'Query', expenses: Array<Maybe<{ __typename?: 'Expense', tran_date?: Maybe<any>, amount: number, description?: Maybe<string>, category?: Maybe<{ __typename?: 'Category', id: number, name?: Maybe<string>, parent?: Maybe<{ __typename?: 'Category', id: number, name?: Maybe<string> }> }>, user?: Maybe<{ __typename?: 'User', id: number, short_name?: Maybe<string> }> }>> };

export type UserByTokenQueryVariables = Exact<{
  userToken?: Maybe<Scalars['String']>;
}>;


export type UserByTokenQuery = { __typename?: 'Query', user?: Maybe<{ __typename?: 'User', id: number, short_name?: Maybe<string>, group_code?: Maybe<number> }> };


export const CategoriesDocument = gql`
    query Categories($groupCode: Int!, $typ: Int) {
  categories(group_code: $groupCode, typ: $typ) {
    id
    name
    parent_id
    parent {
      id
      name
    }
  }
}
    `;

/**
 * __useCategoriesQuery__
 *
 * To run a query within a React component, call `useCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoriesQuery({
 *   variables: {
 *      groupCode: // value for 'groupCode'
 *      typ: // value for 'typ'
 *   },
 * });
 */
export function useCategoriesQuery(baseOptions: Apollo.QueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
      }
export function useCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
        }
export type CategoriesQueryHookResult = ReturnType<typeof useCategoriesQuery>;
export type CategoriesLazyQueryHookResult = ReturnType<typeof useCategoriesLazyQuery>;
export type CategoriesQueryResult = Apollo.QueryResult<CategoriesQuery, CategoriesQueryVariables>;
export const ExpensesForSummaryDocument = gql`
    query ExpensesForSummary($groupCode: Int!, $dateFrom: DateTime!, $dateTo: DateTime!, $type: Int) {
  expenses(
    group_code: $groupCode
    date_from: $dateFrom
    date_to: $dateTo
    typ: $type
  ) {
    tran_date
    amount
    description
    category {
      id
      parent {
        id
        name
      }
      name
    }
    user {
      id
      short_name
    }
  }
}
    `;

/**
 * __useExpensesForSummaryQuery__
 *
 * To run a query within a React component, call `useExpensesForSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useExpensesForSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExpensesForSummaryQuery({
 *   variables: {
 *      groupCode: // value for 'groupCode'
 *      dateFrom: // value for 'dateFrom'
 *      dateTo: // value for 'dateTo'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useExpensesForSummaryQuery(baseOptions: Apollo.QueryHookOptions<ExpensesForSummaryQuery, ExpensesForSummaryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ExpensesForSummaryQuery, ExpensesForSummaryQueryVariables>(ExpensesForSummaryDocument, options);
      }
export function useExpensesForSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExpensesForSummaryQuery, ExpensesForSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ExpensesForSummaryQuery, ExpensesForSummaryQueryVariables>(ExpensesForSummaryDocument, options);
        }
export type ExpensesForSummaryQueryHookResult = ReturnType<typeof useExpensesForSummaryQuery>;
export type ExpensesForSummaryLazyQueryHookResult = ReturnType<typeof useExpensesForSummaryLazyQuery>;
export type ExpensesForSummaryQueryResult = Apollo.QueryResult<ExpensesForSummaryQuery, ExpensesForSummaryQueryVariables>;
export const UserByTokenDocument = gql`
    query userByToken($userToken: String) {
  user(token: $userToken) {
    id
    short_name
    group_code
  }
}
    `;

/**
 * __useUserByTokenQuery__
 *
 * To run a query within a React component, call `useUserByTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserByTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserByTokenQuery({
 *   variables: {
 *      userToken: // value for 'userToken'
 *   },
 * });
 */
export function useUserByTokenQuery(baseOptions?: Apollo.QueryHookOptions<UserByTokenQuery, UserByTokenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserByTokenQuery, UserByTokenQueryVariables>(UserByTokenDocument, options);
      }
export function useUserByTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserByTokenQuery, UserByTokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserByTokenQuery, UserByTokenQueryVariables>(UserByTokenDocument, options);
        }
export type UserByTokenQueryHookResult = ReturnType<typeof useUserByTokenQuery>;
export type UserByTokenLazyQueryHookResult = ReturnType<typeof useUserByTokenLazyQuery>;
export type UserByTokenQueryResult = Apollo.QueryResult<UserByTokenQuery, UserByTokenQueryVariables>;