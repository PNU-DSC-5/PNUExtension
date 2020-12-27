import React from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import LocalDiningOutlinedIcon from "@material-ui/icons/LocalDiningOutlined";

import Marquee from "react-marquee-slider";
import { JsxAttribute } from "typescript";

import useAxios from "axios-hooks";

import { Meal } from "../shared/interfaces/meal.interface";
import { Button } from "@material-ui/core";

// yarn add react-marquee-slider
// yarn add lodash styled-components

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    section: {
      height: "100%",
      width: "100%",
      textAlign: "center",
      backgroundColor: theme.palette.secondary.main,
    },
  })
);

export default function MealPlanner(): JSX.Element {
  const classes = useStyles();

  const [{ data: mealData, loading: mealLoading }] = useAxios<Meal>({
    url: "/meal",
    method: "GET",
  });

  if (mealLoading) return <Typography>Loading...</Typography>;

  const marqueeText: JSX.Element[] = [
    <LocalDiningOutlinedIcon fontSize="small" />,
    <Typography variant="h6">
      &#160;[금정회관] 가나 다라 마바 사아 자차 카타 파하 갸냐 댜랴 먀뱌 샤야
      쟈챠 캬탸 퍄햐 &#160;
    </Typography>,
  ];
  const marqueeText2: JSX.Element[] = [
    <LocalDiningOutlinedIcon fontSize="small" />,
    <Typography variant="h6">
      &#160;[샛벌회관] 거너 더러 머버 서어 저처 커터 퍼허 겨녀 뎌려 며벼 셔여
      져쳐 켜텨 펴혀 &#160;
    </Typography>,
  ];
  const marqueeText3: JSX.Element[] = [
    <LocalDiningOutlinedIcon fontSize="small" />,
    <Typography variant="h6">
      &#160;[문창회관] 고노 도로 모보 소오 조초 코토 포호 교뇨 됴료 묘뵤 쇼요
      죠쵸 쿄툐 표효 {mealData ? mealData : "왜"} &#160;
    </Typography>,
  ];

  return (
    <Paper className={classes.section}>
      <Button>
        <Typography
          variant="body1"
          align="center"
          color="textPrimary"
          style={{ fontWeight: "bold" }}
        >
          학식
        </Typography>
      </Button>
      <div style={{ marginTop: "10" }}>
        <Marquee
          children={marqueeText}
          direction="rtl"
          velocity={30}
          scatterRandomly={false}
          resetAfterTries={1000}
          onInit={() => {}}
          onFinish={() => {}}
        />
        <Marquee
          children={marqueeText2}
          direction="rtl"
          velocity={30}
          scatterRandomly={false}
          resetAfterTries={1000}
          onInit={() => {}}
          onFinish={() => {}}
        />
        <Marquee
          children={marqueeText3}
          direction="rtl"
          velocity={30}
          scatterRandomly={false}
          resetAfterTries={1000}
          onInit={() => {}}
          onFinish={() => {}}
        />
      </div>
    </Paper>
  );
}
