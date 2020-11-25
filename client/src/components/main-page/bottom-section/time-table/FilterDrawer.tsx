import React from 'react';
import {
  Drawer, List, ListItem, Accordion, AccordionSummary,
  AccordionDetails, Typography, Box, Button, Divider, TextField,
  AppBar, Toolbar
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import SchoolClassData from '../../../../shared/data/form-2020-2.json';
import CategoryData from '../../../../shared/data/category.json';

import { SchoolClass, ClassCategory } from '../shared/interfaces/timeTable.inteface';


const useStyles = makeStyles((theme: Theme) => createStyles({
  drawer: {
    backgroundColor: '#e9ecef'
  },
  root: {
    display: 'flex',
    flexDirection: 'row',
    height: '600px',
  },
  accordian: {

  },
  filterBox: {
    display: 'inline-flex',
    flexDirection: 'column',
    position: 'fixed',
    width: '500px',
    backgroundColor: '#e9ecef',
  },
  listBox: {
    width: '100%',
    marginLeft: '516px',
    marginRight: '32px',
    border: '1px solid gray',
    borderRadius: 16,
    marginTop: '16px',
    height: 'fit-content',
    minHeight: '400px',
    backgroundColor: 'white',
  },
  schoolListItem: {
    borderRadious: 16
  },
  schoolListItemText: {
    display: 'inline-flex',
    flexDirection: 'row',
    padding: 16,
    width: '100%'
  }
}));

export interface FilterDrawerProps {
  drawerOpen: boolean;
  handleDrawer: (isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
  handlers: ((newClass: SchoolClass) => void)[]
}

/**
 * 수업 등록을 위한 카테고리 필터 컴포넌트
 * 1. 영역 필터링
 *    교선, 일선, 전공, 교필
 * 2. 검색어 수업 검색
 * 3. 정렬 , 학년, 학점 은 추후에
 * @param props  
 */
export default function FilterDrawer(props: FilterDrawerProps): JSX.Element {
  const { drawerOpen, handleDrawer, handlers } = props;
  const classes = useStyles();

  const [classList, setClassList] = React.useState<SchoolClass[]>([]);
  const originCategory: ClassCategory = CategoryData;
  const college: string[] = Object.keys(CategoryData);
  const categorys = (collegeName: string) => originCategory[collegeName];

  const [selectedCategory, setSelectedCategory] = React.useState<string>('');

  const handleSelectCategory = (department: string, category: string) => {
    const filtered = SchoolClassData as SchoolClass[]
    setSelectedCategory(category);
    setClassList(filtered.filter((each) => each['대학명'] === department && each['주관학과명'] === category))
  }

  const days = ['월', '화', '수', '목', '금', '토'];

  return (
    <Drawer
      anchor="bottom"
      open={drawerOpen}
      onClose={handleDrawer(false)}
      classes={{ paper: classes.drawer }}
    >

      <div className={classes.root}>
        <Box className={classes.filterBox}>
          <Accordion style={{
            marginBottom: 16,
            margin: 16,
            border: "1px solid gray",
            borderRadius: 16
          }}>
            <AccordionSummary
              style={{
                padding: 32,
              }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography variant="h6">
                대학명/개설학과명
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              style={{
                maxHeight: '400px',
                display: 'inline-flex',
                flexDirection: 'column',
                overflow: 'scroll',
                overflowX: 'hidden',
                padding: 0,
                width: '100%'
              }}
            >
              {college.map((col) => (

                <Accordion
                  style={{
                    width: 'auto',
                    height: '100%',
                    marginRight: '16px'
                  }}
                >

                  <AccordionSummary
                    style={{
                      padding: 0
                    }}
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography variant="h5" style={{ marginLeft: '32px', padding: 8 }}>
                      {col}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails
                    style={{
                      maxHeight: '400px',
                      overflowY: 'scroll',
                      overflowX: 'hidden',
                    }}
                  >
                    <List

                    >
                      {categorys(col).map((category) => (
                        <ListItem
                          button
                          onClick={() => {
                            handleSelectCategory(col, category)
                          }}
                        >
                          <Typography variant="h6" style={{ padding: 4 }}>
                            {category}
                          </Typography>

                        </ListItem>
                      ))}
                    </List>

                  </AccordionDetails>
                </Accordion>

              ))}
            </AccordionDetails>
          </Accordion>

          <Accordion style={{
            marginBottom: 16,
            margin: 16,
            border: "1px solid gray",
            borderRadius: 16
          }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" style={{ padding: 32 }}>
                과목명 검색
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              style={{
                maxHeight: '400px',
              }}
            >
              <div style={{ padding: 32 }}>
                <TextField />
              </div>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box className={classes.listBox}>
          <List>
            {selectedCategory &&
              classList
                .map((info) => {
                  return (
                    <div>
                      <ListItem
                        button
                        className={classes.schoolListItem}
                        onClick={() => {
                          const targetWeek = info['시간표'].split(',');
                          handlers[days.indexOf(targetWeek[0][0])](info);
                          if (targetWeek.length > 1) handlers[days.indexOf(targetWeek[1][0])](info);
                        }}
                      >
                        <div className={classes.schoolListItemText}>
                          <Typography variant="h6" style={{ width: '30%' }}>{info['교과목명']}</Typography>
                          <Typography variant="h6" style={{ width: '15%' }} align="center">{info['분반']}</Typography>
                          <Typography variant="h6" style={{ width: '40%' }}>{info['시간표']}</Typography>
                        </div>
                      </ListItem>
                      <Divider />
                    </div>
                  )

                })}
          </List>
        </Box>
      </div>
    </Drawer >
  );
}
