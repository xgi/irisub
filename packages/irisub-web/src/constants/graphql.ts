import { gql } from "@apollo/client";

export const INSERT_PROJECT = gql`
  mutation InsertProject($object: projects_insert_input!) {
    insert_projects_one(object: $object) {
      id
      title
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($project_id: uuid!) {
    projects_by_pk(id: $project_id) {
      id
      title
    }
  }
`;

export const CHANGE_PROJECT_TITLE = gql`
  mutation ChangeProjectTitle($project_id: uuid!, $title: String!) {
    update_projects_by_pk(pk_columns: { id: $project_id }, _set: { title: $title }) {
      id
    }
  }
`;

export const INSERT_EVENT = gql`
  mutation InsertEvent($object: events_insert_input!) {
    insert_events_one(object: $object) {
      id
      text
      start_ms
      end_ms
      index
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($event_id: uuid!, $event: events_set_input) {
    update_events_by_pk(pk_columns: { id: $event_id }, _set: $event) {
      id
      text
      start_ms
      end_ms
      index
    }
  }
`;

export const CHANGE_EVENT_TEXT = gql`
  mutation ChangeEventText($event_id: uuid!, $text: String!) {
    update_events_by_pk(pk_columns: { id: $event_id }, _set: { text: $text }) {
      id
    }
  }
`;

export const EVENT_SUBSCRIPTION_FOR_PROJECT = gql`
  subscription SubscribeToEventsForProject($project_id: uuid!) {
    events(where: { project_id: { _eq: $project_id } }) {
      id
      index
      start_ms
      end_ms
      text
    }
  }
`;
