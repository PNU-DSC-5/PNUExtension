import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import CrawlingCard from './card/CrawlingCard';
import WeekTable from './time-table/WeekTable';
import MealPlanner from './meal-planner/MealPlanner';
import Todo from './to-do/Todo';
import CategoryButton from './category/CategoryButton';

// styles

// Grid

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
}));

const dummy = [
  {
    연번: 1699,
    대학명: '사범대학',
    주관학과: 362100,
    주관학과명: '교육학과',
    학년: 3,
    교과목코드: 'XA40360',
    분반: '005',
    교과목명: '학교폭력예방및학생의이해',
    영문교과목명: 'UNDERSTANDING STUDENTS AND SCHOOL VIOLENCE PREVENTION',
    교과구분: '교직과목',
    학점: 2,
    이론: 2,
    실습: 0,
    교수명: '설정희',
    제한인원: 25,
    시간표: '화 17:00 (100) 417-510',
    교양영역: '',
    원어: '',
    팀티칭: '',
    원격: '',
    비고: '',
  },
  {
    연번: 1716,
    대학명: '사범대학',
    주관학과: 362300,
    주관학과명: '유아교육과',
    학년: 2,
    교과목코드: 'ER34348',
    분반: '076',
    교과목명: '아동수학지도',
    영문교과목명: 'MATHEMATICS INSTRUCTION FOR CHILDREN',
    교과구분: '전공선택',
    학점: 3,
    이론: 3,
    실습: 0,
    교수명: '정혜영',
    제한인원: 19,
    시간표: '화 15:00 (75) 211-A202,목 15:00 (75) 211-A202',
    교양영역: '',
    원어: '',
    팀티칭: '',
    원격: '',
    비고: '',
  },
  {
    연번: 1754,
    대학명: '사범대학',
    주관학과: 363060,
    주관학과명: '통합사회전공',
    학년: 3,
    교과목코드: 'SD34599',
    분반: '075',
    교과목명: '통합사회논리및논술',
    영문교과목명: 'LOGIC & WRITING OF INTEGRATED SOCIAL SCIENCE EDUCATION',
    교과구분: '전공선택',
    학점: 3,
    이론: 3,
    실습: 0,
    교수명: '백종성/김효성/장혜진/박미향',
    제한인원: 15,
    시간표: '금 14:00 (180) 417-102',
    교양영역: '',
    원어: '',
    팀티칭: 'Y',
    원격: '',
    비고: '',
  },
  {
    연번: 1,
    대학명: '교육혁신과',
    주관학과: 127100,
    주관학과명: '교육혁신과',
    학년: 0,
    교과목코드: 'EA12620',
    분반: '001',
    교과목명: '소비문화',
    영문교과목명: 'CONSUMER CULTURE',
    교과구분: '일반선택',
    학점: 3,
    이론: 3,
    실습: 0,
    교수명: '',
    제한인원: 30,
    시간표: '토 10:00 (180)',
    교양영역: '',
    원어: '',
    팀티칭: '',
    원격: 'Y',
    비고: 'KNU-9',
  },
];

export default function BottomTest(): JSX.Element {
  const classes = useStyles();

  const category: any[] = [
    // 백엔드에서 DB 받아올 예정
    // {
    //   id: 1,
    //   title: '2021학년도 정보융합공학과 대학원 전기 신입생 모집 안내',
    //   href:
    //     'https://cse.pusan.ac.kr/bbs/cse/2605/839346/artclView.do?layout=unknown',
    //   content: '2020-11-11',
    // },
    // {
    //   id: 2,
    //   title: 'CSE TED 2020 11.20(금) 우균, 전혜란(미국 UC Merced 컴퓨터공학과)',
    //   href:
    //     'https://cse.pusan.ac.kr/bbs/cse/2605/839340/artclView.do?layout=unknown',
    //   content: '2020-11-11',
    // },
    // {
    //   id: 3,
    //   title: 'CSE TED 2020 11.17(화) 이명호 교수님 세미나 안내(16:30~17:00)',
    //   href:
    //     'https://cse.pusan.ac.kr/bbs/cse/2605/839329/artclView.do?layout=unknown',
    //   content: '2020-11-11',
    // },
    // {
    //   id: 4,
    //   title: '[2020 RTHON] R을 활용한 공공 데이터 패키지 만들기',
    //   href: 'https://onoffmix.com/event/228188',
    //   content: '2020.11.27 (금) 0:00 ~ 2020.11.29 (일) 0:00',
    // },
    // { id: 5, title: '', href: '' },
    // {
    //   id: 6,
    //   title: '코이카와 함께하는 4060 국제개발협력 일자리 해커톤',
    //   href: 'https://onoffmix.com/event/228025',
    //   content: '2020.11.19 (목) 9:00 ~ 2020.11.20 (금) 18:00',
    // },
    // {
    //   id: 7,
    //   title:
    //     '(2021) [ STM32Cube.AI ] 서울 하드웨어 해커톤 | Seoul Hardware Hackathon',
    //   href: 'https://onoffmix.com/event/227927',
    //   content: '2021.1.2 (토) 0:00 ~ 2021.1.3 (일) 0:00',
    // },
    // {
    //   id: 8,
    //   title:
    //     '[AI 리뷰] 머신러닝으로 화상회의에서 배경 마음대로 바꾼다... 구글 미트 새로운 AI 기능',
    //   href: 'http://www.aitimes.kr/news/articleView.html?idxno=18304',
    //   content: '2020-11-11',
    // },
    // {
    //   id: 9,
    //   title:
    //     '상용화에 돌입한 AI 아나운서... 김주하 AI 아나운서, 말 뉘앙스, 제스처, 표정 등 실제와 차이를 느끼지 못했다',
    //   href: 'http://www.aitimes.kr/news/articleView.html?idxno=18342',
    //   content: '2020-11-11',
    // },
    // {
    //   id: 10,
    //   title: 'NXP, AI 안면인식 솔루션 저비용.저전력 MCU 기반 엣지레디 발표',
    //   href: 'http://www.aitimes.kr/news/articleView.html?idxno=18307',
    //   content: '2020-11-11',
    // },
  ];

  // Card에 데이터 전달
  const CrawlingSection = (
    id: number, // id
    title: string, // 제목
    href: string, // url
    content: string, // 내용
  ): JSX.Element => <CrawlingCard id={id} title={title} href={href} content={content} />;

  // 시간표, 학식, 할일 Card
  const SpecialSection = (): JSX.Element => (
    <GridList
      cellHeight={150}
      className={classes.gridList}
      cols={1}
      spacing={5}
      style={{
        width: '300px',
        position: 'fixed',
      }}
    >
      <GridListTile cols={1}>
        <WeekTable
          schoolClasses={dummy}
        />
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
    const {
      id, title, href, content,
    } = elem;
    return (
      <GridListTile key={id} cols={1}>
        {id === 5
          ? SpecialSection()
          : CrawlingSection(
            id,
            title as string,
            href as string,
            content as string,
          )}
      </GridListTile>
    );
  });

  return (
    <div>
      <CategoryButton />
      {SpecialSection()}
      <GridList
        cellHeight={400}
        className={classes.gridList}
        cols={5}
        spacing={10}
      >
        {bottomSection}
      </GridList>
    </div>
  );
}
