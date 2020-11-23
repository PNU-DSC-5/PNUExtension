import React from 'react';
import {
  Drawer, List, ListItem, Accordion, AccordionSummary,
  AccordionDetails, Typography,
} from '@material-ui/core';
import SchoolClassData from '../../../../shared/data/regular-2020-2.json';
import { SchoolClass } from '../shared/interfaces/timeTable.inteface';

export interface FilterDrawerProps {
  drawerOpen: boolean;
  handleDrawer: (isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
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
  const { drawerOpen, handleDrawer } = props;

  const [classList, setClassList] = React.useState<SchoolClass[]>((SchoolClassData as SchoolClass[]).slice(0, 100));

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
          height: '400px',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            position: 'fixed',
            width: '300px',
          }}
        >
          <Accordion>
            <AccordionSummary>
              <Typography>
                TEST1
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              style={{
                maxHeight: '200px',
              }}
            >
              <Typography style={{ height: 800 }}>
                TEST1
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary>
              <Typography>
                TEST2
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              style={{
                maxHeight: '200px',
              }}
            >
              <Typography>
                TEST2
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
        <div
          style={{
            marginLeft: '300px',
            width: '70%',
          }}
        >
          <List>
            {classList.map(() => (
              <ListItem>
                ok
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </Drawer>
  );
}
