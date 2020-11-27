import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import useAxios from 'axios-hooks';
import CrawlingCard from './card/CrawlingCard';
import WeekTable from './time-table/WeekTable';
import MealPlanner from './meal-planner/MealPlanner';
import Todo from './to-do/Todo';
import CategoryButton from './category/CategoryButton';

import { SchoolClass } from './shared/interfaces/timeTable.inteface';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    // overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
  },
  specialTile: {

  },
}));
const category: any[] = [
  // 백엔드에서 DB 받아올 예정
  {
    id: 1,
    title: '2021학년도 정보융합공학과 대학원 전기 신입생 모집 안내',
    href:
      'https://cse.pusan.ac.kr/bbs/cse/2605/839346/artclView.do?layout=unknown',
    content: '2020-11-11',
  },
  {
    id: 2,
    title: 'CSE TED 2020 11.20(금) 우균, 전혜란(미국 UC Merced 컴퓨터공학과)',
    href:
      'https://cse.pusan.ac.kr/bbs/cse/2605/839340/artclView.do?layout=unknown',
    content: '2020-11-11',
  },
  {
    id: 3,
    title: 'CSE TED 2020 11.17(화) 이명호 교수님 세미나 안내(16:30~17:00)',
    href:
      'https://cse.pusan.ac.kr/bbs/cse/2605/839329/artclView.do?layout=unknown',
    content: '2020-11-11',
  },
  {
    id: 4,
    title: '[2020 RTHON] R을 활용한 공공 데이터 패키지 만들기',
    href: 'https://onoffmix.com/event/228188',
    content: '2020.11.27 (금) 0:00 ~ 2020.11.29 (일) 0:00',
  },
  { id: 5, title: '', href: '' },
  {
    id: 6,
    title: '코이카와 함께하는 4060 국제개발협력 일자리 해커톤',
    href: 'https://onoffmix.com/event/228025',
    content: '2020.11.19 (목) 9:00 ~ 2020.11.20 (금) 18:00',
  },
  {
    id: 7,
    title:
      '(2021) [ STM32Cube.AI ] 서울 하드웨어 해커톤 | Seoul Hardware Hackathon',
    href: 'https://onoffmix.com/event/227927',
    content: '2021.1.2 (토) 0:00 ~ 2021.1.3 (일) 0:00',
  },
  {
    id: 8,
    title:
      '[AI 리뷰] 머신러닝으로 화상회의에서 배경 마음대로 바꾼다... 구글 미트 새로운 AI 기능',
    href: 'http://www.aitimes.kr/news/articleView.html?idxno=18304',
    content: '2020-11-11',
  },
  {
    id: 9,
    title:
      '상용화에 돌입한 AI 아나운서... 김주하 AI 아나운서, 말 뉘앙스, 제스처, 표정 등 실제와 차이를 느끼지 못했다',
    href: 'http://www.aitimes.kr/news/articleView.html?idxno=18342',
    content: '2020-11-11',
  },
  {
    id: 10,
    title: 'NXP, AI 안면인식 솔루션 저비용.저전력 MCU 기반 엣지레디 발표',
    href: 'http://www.aitimes.kr/news/articleView.html?idxno=18307',
    content: '2020-11-11',
  },
];

export default function BottomTest(): JSX.Element {
  const classes = useStyles();
  const category: any[] = [
    //백엔드에서 DB 받아올 예정
    {
      id: 1,
      title: '2021학년도 정보융합공학과 대학원 전기 신입생 모집 안내',
      href:
        'https://cse.pusan.ac.kr/bbs/cse/2605/839346/artclView.do?layout=unknown',
      content: '2020-11-11',
      category: '정컴 공지사항',
    },
    {
      id: 2,
      title: 'CSE TED 2020 11.20(금) 우균, 전혜란(미국 UC Merced 컴퓨터공학과)',
      href:
        'https://cse.pusan.ac.kr/bbs/cse/2605/839340/artclView.do?layout=unknown',
      content: '2020-11-11',
      category: '정컴 공지사항',
    },
    {
      id: 3,
      title: 'CSE TED 2020 11.17(화) 이명호 교수님 세미나 안내(16:30~17:00)',
      href:
        'https://cse.pusan.ac.kr/bbs/cse/2605/839329/artclView.do?layout=unknown',
      content: '2020-11-11',
      category: '정컴 공지사항',
    },
    {
      id: 4,
      title: '[2020 RTHON] R을 활용한 공공 데이터 패키지 만들기',
      href: 'https://onoffmix.com/event/228188',
      content: '2020.11.27 (금) 0:00 ~ 2020.11.29 (일) 0:00',
      category: 'Hackathon',
    },
    { id: 5, title: '', href: '' },
    {
      id: 6,
      title: '코이카와 함께하는 4060 국제개발협력 일자리 해커톤',
      href: 'https://onoffmix.com/event/228025',
      content: '2020.11.19 (목) 9:00 ~ 2020.11.20 (금) 18:00',
      category: 'Hackathon',
    },
    {
      id: 7,
      title:
        '(2021) [ STM32Cube.AI ] 서울 하드웨어 해커톤 | Seoul Hardware Hackathon',
      href: 'https://onoffmix.com/event/227927',
      content: '2021.1.2 (토) 0:00 ~ 2021.1.3 (일) 0:00',
      category: 'Hackathon',
    },
    {
      id: 8,
      title:
        '[AI 리뷰] 머신러닝으로 화상회의에서 배경 마음대로 바꾼다... 구글 미트 새로운 AI 기능',
      href: 'http://www.aitimes.kr/news/articleView.html?idxno=18304',
      content: '2020-11-11',
      category: 'IT News',
    },
    {
      id: 9,
      title:
        '상용화에 돌입한 AI 아나운서... 김주하 AI 아나운서, 말 뉘앙스, 제스처, 표정 등 실제와 차이를 느끼지 못했다',
      href: 'http://www.aitimes.kr/news/articleView.html?idxno=18342',
      content: '2020-11-11',
      category: 'IT News',
    },
    {
      id: 10,
      title: 'NXP, AI 안면인식 솔루션 저비용.저전력 MCU 기반 엣지레디 발표',
      href: 'http://www.aitimes.kr/news/articleView.html?idxno=18307',
      content: '2020-11-11',
      category: 'IT News',
    },
  ];

  //Card에 데이터 전달
  const CrawlingSection = (
    id: number, //id
    title: string, //제목
    href: string, //url
    content: string, //내용
    category: string, //카테고리
  ): JSX.Element => {
    return (
      <CrawlingCard
        id={id}
        title={title}
        href={href}
        content={content}
        category={category}
      />
    );
  };

  // 시간표, 학식, 할일 Card
  const SpecialSection = (): JSX.Element => (
    <GridList
      cellHeight={150}
      className={classes.gridList}
      cols={1}
      spacing={5}
      style={{
        // width: '300px',
        // position: 'fixed',
      }}
    >
      <GridListTile cols={1} className={classes.specialTile}>
        <WeekTable />
      </GridListTile>
      <GridListTile cols={1}>
        <MealPlanner />
      </GridListTile>
      <GridListTile cols={1}>
        <Todo />
      </GridListTile>
    </GridList>
  );

  // category에 있는 데이터를 Card 형태로 출력
  const bottomSection = category.map((elem) => {
    const { id, title, href, content, category } = elem;
    return (
      <GridListTile key={id} cols={1}>
        {id === 5
          ? SpecialSection()
          : CrawlingSection(
            id,
            title as string,
            href as string,
            content as string,
            category as string,
          )}
      </GridListTile>
    );
  });

  return (
    <div>
      <CategoryButton />
      <GridList
        cellHeight={450}
        className={classes.gridList}
        cols={5}
        spacing={30}
      >
        {bottomSection}
      </GridList>
    </div >
  );
}
