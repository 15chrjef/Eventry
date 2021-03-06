import React from 'react';
import { Block } from 'baseui/block';
import { Label1 } from 'baseui/typography';
import HeaderNavigation from '../components/header-navigation';
import {
  Display4,
  Paragraph1,
} from 'baseui/typography';

export default function About() {
  return (
    <Block display="flex" flexDirection="column">
      <HeaderNavigation leftButtons={[]} />
      <Block display="flex" justifyContent="center">
        <Block width={[ '85%', '85%', '55%', '55%' ]} marginTop="60px" marginBottom="120px">
          <Block display="flex" justifyContent="center">
            <img width="70%" src="https://www.fiftheagle.com/wp-content/uploads/2019/03/our-team.png" />
          </Block>
          <Display4 color="#484848">Welcome To TeamBright</Display4>
          <Paragraph1 color="#212121">
            We believe that teams perform more effectively when enhanced with strong personal bonds between team members.
          </Paragraph1>
          <Paragraph1 color="#212121">
            Our mission is to make teams stronger and achieve higher performance. Within this belief we want to make corporate events fun and easy all the way from the early search and discovery, to the team decision, and finally to the team event itself.
          </Paragraph1>
          <Paragraph1 color="#212121">
            TeamBright was built by people who were tired of jumping through hoops to have awesome experiences with their teams and colleagues outside the office. We know the difficulty of finding great events that are acceptable for the whole team as well as all the hassles of booking that come afterwards.
          </Paragraph1>
          <Paragraph1 color="#212121">
            If you have any comment or question, please reach out. We would love to hear from you.
          </Paragraph1>
        </Block>
      </Block>
      <Block backgroundColor="#f7f7f7" padding="48px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Label1 color="#484848"><b>team@teambright.co</b></Label1>
        <Label1 color="#484848" $as="a" href="/privacy"><b>Privacy Policy</b></Label1>
      </Block>
    </Block>
  );
}
