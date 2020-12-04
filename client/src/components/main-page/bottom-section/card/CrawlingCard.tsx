import React from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Cards from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { Card } from "../shared/interfaces/card.interface";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    section: {
      height: "100%",
      width: "100%",
      textAlign: "center",
      background: theme.palette.primary.main,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
    },
  })
);

// input의 type
interface Props {
  card: Card;
}

const CrawlingCard = (input: Props) => {
  const classes = useStyles();
  return (
    <Cards className={classes.section}>
      <CardActionArea href={input.card.href}>
        {
          <CardMedia
            component="img"
            alt={input.card.title}
            height="240"
            image={input.card.href}
            title={input.card.title}
          />
        }
        <Typography variant="caption">{input.card.category}</Typography>
        <CardContent style={{ alignSelf: "flex-end" }}>
          <Typography gutterBottom variant="h6" component="h2">
            {input.card.title}
          </Typography>
          <Typography variant="body2" component="p">
            {input.card.context}
          </Typography>
          <Typography variant="body2" component="p">
            {input.card.date}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Cards>
  );
};

export default CrawlingCard;
