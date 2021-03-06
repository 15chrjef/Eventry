import gql from 'graphql-tag';
import {
  User,
  Review,
  EventListItem,
  EventDetails,
  Poll
} from './fragment';

export const LOAD_VENUE_REVIEWS = gql`
query LoadVenueReviews($symbol: String!){
  getReviewsBySymbol(symbol: $symbol)${Review}
  getUserByAuth{
    user${User}
  }
  checkUserHasWrittenReview(symbol: $symbol)
}`;

export const GET_REVIEWS_BY_AUTH = gql`
query GetReviewsByAuth{
  getReviewsByAuth${Review}
}`;

export const GET_USER_BY_AUTH = gql`
query GetUserByAuth{
  getUserByAuth{
    token
    user${User}
  }
}`;

export const LOAD_USER_PROFILE = gql`
query LoadUserProfile{
  getUserByAuth{
    token
    user${User}
  }
  getUserProfileByAuth${User}
}`;

export const GET_TEAMS_BY_EMAIL = gql`
query GetTeamsByEmail($email: String!){
  getTeamsByEmail(email: $email){
    id
    name
  }
}`;

export const GET_TEAMS_BY_COMPANY = gql`
query GetTeamsByEmail($companyId: String!){
  getTeamsByCompany(companyId: $companyId){
    id
    name
  }
}`;

export const GET_ALERT_MESSAGE = gql`
query GetAlertMessage{
  successAlert @client
}`;

export const LOAD_BOOKING_FORM = gql`
query LoadBookingForm($symbol: String!){
  getBusinessHours(symbol: $symbol){
    id
    day
    open
    close
  }
}`;

export const GET_BUSINESS_HOURS = gql`
query GetBusinessHours($symbol: String!){
  getBusinessHours(symbol: $symbol){
    id
    day
    open
    close
  }
}`;

export const GET_EVENTS_BY_AUTH = gql`
query GetEventsByAuth{
  getEventsByAuth${EventListItem}
}`;

export const GET_NEW_EVENTS_BY_SYMBOL = gql`
query GetNewEventsBySymbol($symbol: String!){
  getNewEventsBySymbol(symbol: $symbol)${EventListItem}
}`;

export const GET_UPCOMING_EVENTS_BY_SYMBOL = gql`
query GetUpcomingEventsBySymbol($symbol: String!){
  getUpcomingEventsBySymbol(symbol: $symbol)${EventListItem}
}`;

export const GET_UPCOMING_EVENTS_BY_TEAM = gql`
query GetUpcomingEventsByTeam($teamId: String!){
  getUpcomingEventsByTeam(teamId: $teamId)${EventListItem}
}`;

export const GET_CREATED_EVENTS_BY_TEAM = gql`
query GetCreatedEventsByTeam($teamId: String!){
  getCreatedEventsByTeam(teamId: $teamId)${EventListItem}
}`;

export const GET_PAST_EVENTS_BY_SYMBOL = gql`
query GetPastEventsBySymbol($symbol: String!, $skip: Int!){
  getPastEventsBySymbol(symbol: $symbol, skip: $skip)${EventListItem}
}`;

export const GET_PAST_EVENTS_BY_TEAM = gql`
query GetPastEventsByTeam($teamId: String!, $skip: Int!){
  getPastEventsByTeam(teamId: $teamId, skip: $skip)${EventListItem}
}`;

export const AUTHORIZE_EVENT_PAGE = gql`
query AuthorizeEventPage($eventId: String!){
  authorizeEventPage(eventId: $eventId)
}`;

export const GET_EVENT = gql`
query GetEvent($eventId: String!){
  getEvent(eventId: $eventId)${EventDetails}
  getUserByAuth{
    token
    user${User}
  }
}`;

export const GET_TEAM_MEMBERS = gql`
query GetTeamMembers($teamId: String!){
  getTeamMembers(teamId: $teamId)${User}
}`;

export const GET_COMPANY_EMAILS_AND_VALIDATE_TEAM = gql`
query GetCompanyEmailsAndValidateTeam($teamName: String!, $companyId: String!){
  getCompanyEmailsAndValidateTeam(teamName: $teamName, companyId: $companyId){
    emails
    teamFound
  }
}`;

export const GET_COMPANY_EMAILS = gql`
query GetCompanyEmails($teamId: String!){
  getCompanyEmails(teamId: $teamId)
}`;

export const GET_TEAM_POLLS = gql`
query GetTeamPolls($teamId: String!){
  getTeamPolls(teamId: $teamId)${Poll}
}`;

export const GET_SCOPES_BY_AUTH = gql`
query GetScopesByAuth{
  getScopesByAuth
}`;
