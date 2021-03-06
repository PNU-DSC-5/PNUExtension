import React from 'react';
import {
  Drawer, List, ListItem, Accordion, AccordionSummary,
  AccordionDetails, Typography, Box, Button, Divider, TextField,
  AppBar, Toolbar,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import SchoolClassData from '../../../../shared/data/form-2020-2.json';
import CategoryData from '../../../../shared/data/category.json';

import { SchoolClass, ClassCategory, DAYS } from '../shared/interfaces/timeTable.inteface';
import { TimeStringToStringArray } from '../shared/utils/time-table.util';

const useStyles = makeStyles((theme: Theme) => createStyles({
  drawer: {
    backgroundColor: '#e9ecef',
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
    borderRadious: 4,
  },
  schoolListItemText: {
    display: 'inline-flex',
    flexDirection: 'row',
    padding: 16,
    width: '100%',
  },
}));

export interface FilterDrawerProps {
  drawerOpen: boolean;
  handleDrawer: (isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
  handlers: ((newClass: SchoolClass) => void)[];
  handleGetSchoolData: () => void;
  schoolData: SchoolClass[];
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
  const {
    drawerOpen, handleDrawer, handlers, handleGetSchoolData,
  } = props;
  const classes = useStyles();

  const [classList, setClassList] = React.useState<SchoolClass[]>([]);
  const originCategory: ClassCategory = CategoryData;
  const college: string[] = Object.keys(CategoryData);
  const categorys = (collegeName: string) => originCategory[collegeName];

  const [selectedCategory, setSelectedCategory] = React.useState<string>('');

  const handleSelectCategory = (department: string, category: string) => {
    const filtered = SchoolClassData as SchoolClass[];
    setSelectedCategory(category);
    setClassList(filtered.filter((each) => each['대학명'] === department && each['주관학과명'] === category));
  };

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
            border: '1px solid gray',
            borderRadius: 16,
          }}
          >
            <AccordionSummary
              style={{
                padding: 32,
              }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography variant="h6" color="textSecondary">
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
                width: '100%',
              }}
            >
              {college.map((col) => (

                <Accordion
                  style={{
                    width: 'auto',
                    height: '100%',
                    marginRight: '16px',
                  }}
                >

                  <AccordionSummary
                    style={{
                      padding: 0,
                    }}
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography variant="h5" color="textSecondary" style={{ marginLeft: '32px', padding: 8 }}>
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
                    <List>
                      {categorys(col).map((category) => (
                        <ListItem
                          button
                          onClick={() => {
                            handleSelectCategory(col, category);
                          }}
                        >
                          <Typography variant="h6" color="textSecondary" style={{ padding: 4 }}>
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
            border: '1px solid gray',
            borderRadius: 16,
          }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" color="textSecondary" style={{ padding: 32 }}>
                과목명 검색
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              style={{
                maxHeight: '400px',
              }}
            >
              <div style={{ padding: 32 }}>
                <TextField
                  inputProps={{
                    style: {
                      color: 'black',
                    },
                  }}
                />
              </div>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box className={classes.listBox} boxShadow={1}>
          <List>
            {selectedCategory
              && classList
                .map((info) => (
                  <div>
                    <ListItem
                      button
                      className={classes.schoolListItem}
                      onClick={() => {
                        const times = TimeStringToStringArray(info.시간표);
                        if (times[0][0] !== '일') handlers[DAYS.indexOf(times[0][0])](info);
                        if (times[1][0] !== '일') handlers[DAYS.indexOf(times[1][0])](info);
                        handleGetSchoolData();
                      }}
                    >
                      <div className={classes.schoolListItemText}>
                        <Typography variant="h6" color="textSecondary" style={{ width: '30%' }}>{info['교과목명']}</Typography>
                        <Typography variant="h6" color="textSecondary" style={{ width: '15%' }} align="center">{info['분반']}</Typography>
                        <Typography variant="h6" color="textSecondary" style={{ width: '40%' }}>{info['시간표']}</Typography>
                      </div>
                    </ListItem>
                    <Divider />
                  </div>
                ))}
          </List>
        </Box>
      </div>
    </Drawer>
  );
}
