import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStyletron } from 'styletron-react';
import { Block } from 'baseui/block';
import { FormControl } from 'baseui/form-control';
import Input from '../input';
import {
  Display4,
  Label1,
  Label3
} from 'baseui/typography';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'baseui/modal';
import {
  FaUserFriends,
} from 'react-icons/fa';
import {
  useQuery,
  useMutation,
  useApolloClient,
  useLazyQuery
} from '@apollo/react-hooks';

import {
  SEND_TEAM_INVITATION
} from '../../constants/mutation';
import {
  GET_TEAM_MEMBERS,
  GET_COMPANY_EMAILS
} from '../../constants/query';

import {
  showAlert,
  getErrorCode
} from '../../utils';

import Loading from '../loading';
import PillButton from '../pill-button'

function InviteNewMember() {
  const client = useApolloClient();
  const { teamId } = useParams();
  const [ css ] = useStyletron();
  const [ inputingEmail, setInputingEmail ] = useState(false);
  const [ email, setEmail ] = useState('');
  const [ error, setError ] = useState(null);
  const [ getCompanyEmails, { data: companyEmailsData } ] = useLazyQuery(GET_COMPANY_EMAILS);
  const [ sendTeamInvitation, { loading } ] = useMutation(SEND_TEAM_INVITATION);

  const validateForm = () => {
    if (!email.split('@')[1]) {
      setError('Please enter valid email');
      return false;
    }
    if (companyEmailsData && companyEmailsData.getCompanyEmails) {
      const correctEmail = companyEmailsData.getCompanyEmails.reduce((res, e) => {
        if (String(email.split('@')[1]).toLowerCase() === e.toLowerCase()) {
          return true;
        }
        return res;
      }, false);
      if (!correctEmail) {
        setError(`Please enter your company email such as ${companyEmailsData.getCompanyEmails[0]}`);
      }
      return correctEmail;
    }
    return true;
  };

  const handleSendInvitation = async () => {
    if (!validateForm()) {
      return;
    }
    const response = await sendTeamInvitation({
      variables: {
        email,
        teamId
      }
    }).catch((e) => {
      setError(getErrorCode(e));
    });

    if (response) {
      setInputingEmail(false);
      showAlert(client, `Successfully sent an invite to ${email}`);
    }
  };

  if (loading) {
    return <Loading compact={true} />;
  }

  return [
    <PillButton
      size="compact"
      onClick={() => {
        setInputingEmail(true);
        getCompanyEmails({
          variables: {
            teamId
          }
        });
      }}
    >
      Invite your team <FaUserFriends style={{ marginLeft: '8px' }} />
    </PillButton>,
    <Modal onClose={() => setInputingEmail(false)} isOpen={inputingEmail}>
      <ModalHeader>Send Invitation</ModalHeader>
      <ModalBody>
        <FormControl label="Invite your team" error={error} positive="">
          <Input
            value={email}
            type="text"
            placeholder="email for invitation"
            onChange={e => {
              setEmail(e.currentTarget.value);
            }}
          />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <PillButton
          onClick={handleSendInvitation}
          loading={loading}
        >
          Send Invitation
        </PillButton>
      </ModalFooter>
    </Modal>
  ];
}
function Member({ member }) {
  const {
    firstName,
    lastName,
    email
  } = member;
  return (
    <Block
      backgroundColor="#f6f6f6"
      padding="12px"
      margin="6px"
      overrides={{
        Block: {
          style: {
            borderRadius: '15px'
          }
        }
      }}
    >
      <Label1>{firstName} {lastName}</Label1>
      <Label3>{email}</Label3>
    </Block>
  );
}
export default function() {
  const { teamId } = useParams();
  const { data, loading, error } = useQuery(GET_TEAM_MEMBERS, {
    variables: {
      teamId
    }
  });

  if (loading || error) {
    return <Loading />;
  }

  const {
    getTeamMembers: members
  } = data;

  return (
    <Block
      display="flex"
    >
      <Block
        flex="1"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        width="fit-content"
      >
        <Block display="flex" alignItems="center">
          <Display4><b>Members</b></Display4>
          <Block marginLeft="12px" />
          <InviteNewMember />
        </Block>
        {
          members.map((member) => {
            return <Member key={member.id} member={member} />;
          })
        }
      </Block>
    </Block>
  );
}
