import React from 'react';
import {
  Drawer, List, ListItem, Accordion, AccordionSummary,
  AccordionDetails, Typography, Box, Button
} from '@material-ui/core';

import SchoolClassData from '../../../../shared/data/form-2020-2.json';
import CategoryData from '../../../../shared/data/category.json';

import { SchoolClass, ClassCategory } from '../shared/interfaces/timeTable.inteface';

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

  const [classList, setClassList] = React.useState<SchoolClass[]>([]);
  const originCategory: ClassCategory = CategoryData;
  const college: string[] = Object.keys(CategoryData);
  const categorys = (collegeName: string) => originCategory[collegeName];

  const [selectedDepartment, setSelectedDepartment] = React.useState<string>('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');

  const handleSelectDepartment = (department: string) => {
    setSelectedDepartment(department);
  }

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
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '600px',
        }}
      >
        <Box
          border
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            position: 'fixed',
            width: '400px',
          }}
        >
          <Accordion
            style={{
              margin: 16,
              marginBottom: 16
            }}
          >
            <AccordionSummary
              style={{
                padding: 32
              }}
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
                  >
                    <Typography variant="h6" style={{ marginLeft: '16px' }}>
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
                            handleSelectCategory(col, category)
                          }}
                        >
                          <Typography variant="body1">
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

          <Accordion
            style={{
              margin: 16
            }}
          >
            <AccordionSummary>
              <Typography variant="h6" style={{ padding: 32 }}>
                과목명 검색
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              style={{
                maxHeight: '400px',
              }}
            >
              <Typography>
                TEST2
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box
          style={{
            marginLeft: '450px',
            width: '100%',
          }}
        >
          <List>
            {selectedCategory &&
              classList
                .map((info) => {
                  return (
                    <ListItem
                      button
                      style={{
                        borderBottom: '1px solid gray'
                      }}
                      onClick={() => {
                        const targetWeek = info['시간표'].split(',');
                        handlers[days.indexOf(targetWeek[0][0])](info);
                        if (targetWeek.length > 1) handlers[days.indexOf(targetWeek[1][0])](info);
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          flexDirection: 'row',
                          padding: 16,
                          width: '100%'
                        }}
                      >
                        <Typography style={{ width: '15%' }}>{info['교과목명']}</Typography>
                        <Typography style={{ width: '15%' }} align="center">{info['분반']}</Typography>
                        <Typography style={{ width: '15%' }}>{info['시간표']}</Typography>
                      </div>
                    </ListItem>
                  )

                })}
          </List>
        </Box>
      </div>
    </Drawer >
  );
}
