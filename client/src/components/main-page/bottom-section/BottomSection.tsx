import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import useAxios from "axios-hooks";
import CrawlingCard from "./card/CrawlingCard";
import WeekTable from "./time-table/WeekTable";
import MealPlanner from "./meal-planner/MealPlanner";
import Todo from "./to-do/Todo";
import CategoryButton from "./category/CategoryButton";

import { Card } from "./shared/interfaces/card.interface";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({ 
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      // overflow: 'hidden', 
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: "100%",
    },
    specialTile: {},
  })
);

export default function BottomTest(): JSX.Element {
  const classes = useStyles();

  //서버로부터 card 데이터를 받아옴
  const [{ data: cardData, loading }] = useAxios<Card[]>({
    url: "/card",
    method: "GET",
  });

  //CrawlingCard에 데이터 전달
  const CrawlingSection = (card: Card): JSX.Element => {
    return <CrawlingCard card={card} />;
  };

  // 시간표, 학식, 할일 Card
  const SpecialSection = (): JSX.Element => (
    <GridListTile cols={1}>
      <GridList
        cellHeight={150}
        className={classes.gridList}
        cols={1}
        spacing={5}
        style={
          {
            // width: '300px',
            // position: 'fixed',
          }
        }
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
    </GridListTile>
  );

  // cardData에 있는 데이터를 Card 형태로 출력
  const bottomSection = (): Array<JSX.Element> => {
    //cardData가 존재하면
    if (cardData) {
      const result: JSX.Element[] = cardData.map((elem) => {
        return <GridListTile cols={1}>{CrawlingSection(elem)}</GridListTile>;
      });
      result.splice(4, 0, SpecialSection()); //5번째 index 자리에 SpecialSection 추가
      console.log(result);
      return result;
    }

    //cardData가 없을 때
    return [SpecialSection()];
  };

  //데이터를 받아오는 동안 Loading 메시지를 출력
  if (loading) return <Typography>Loading...</Typography>;

  return (
    <div>
      <CategoryButton />

      <GridList
        cellHeight={450}
        className={classes.gridList}
        cols={5}
        spacing={30}
      >
        {bottomSection()}
      </GridList>
    </div>
  );
}
