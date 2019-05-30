import React from 'react';
import PropTypes from 'prop-types';
import _styled from '@emotion/styled';
import { Icon, colors, lengths, buttons } from 'netlify-cms-ui-default';

const TopBar = _styled.div`
  display: flex;
  justify-content: space-between;
  height: 26px;
  border-radius: ${lengths.borderRadius} ${lengths.borderRadius} 0 0;
  position: relative;
`;

const TopBarButton = _styled.button`
  ${buttons.button};
  color: ${colors.controlLabel};
  background: transparent;
  font-size: 16px;
  line-height: 1;
  padding: 0;
  width: 32px;
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TopBarButtonSpan = TopBarButton.withComponent('span');

const DragIconContainer = _styled(TopBarButtonSpan)`
  width: 100%;
  cursor: move;
`;

const DragHandle = ({ dragHandleHOC }) => {
  const Handle = dragHandleHOC(() => (
    <DragIconContainer>
      <Icon type="drag-handle" size="small" />
    </DragIconContainer>
  ));
  return <Handle />;
};

const ListItemTopBar = ({ className, collapsed, onCollapseToggle, onRemove, dragHandleHOC, label }) => (
  <TopBar className={className}>
    {onCollapseToggle ? (
      <TopBarButton onClick={onCollapseToggle}>
        <Icon type="chevron" size="small" direction={collapsed ? 'right' : 'down'} />
      </TopBarButton>
    ) : null}
    <span style={{whiteSpace: 'nowrap', display: 'inline-block', width: '250px'}}>{label}</span>
    {dragHandleHOC ? <DragHandle dragHandleHOC={dragHandleHOC} /> : null}
    <span style={{whiteSpace: 'nowrap', display: 'inline-block', width: '250px'}}></span>
    {onRemove ? (
      <TopBarButton onClick={onRemove}>
        <Icon type="close" size="small" />
      </TopBarButton>
    ) : null}
  </TopBar>
);

ListItemTopBar.propTypes = {
  className: PropTypes.string,
  collapsed: PropTypes.bool,
  onCollapseToggle: PropTypes.func,
  onRemove: PropTypes.func,
};

const StyledListItemTopBar = _styled(ListItemTopBar)`
  display: flex;
  justify-content: space-between;
  height: 26px;
  border-radius: ${lengths.borderRadius} ${lengths.borderRadius} 0 0;
  position: relative;
`;

export default StyledListItemTopBar;