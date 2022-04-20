import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { I18nContext } from '../../../contexts/i18n';
import ActionableMessage from '../../ui/actionable-message';
import Box from '../../ui/box';
import Typography from '../../ui/typography';
import {
  ALIGN_ITEMS,
  BLOCK_SIZES,
  COLORS,
  DISPLAY,
  FLEX_DIRECTION,
  TYPOGRAPHY,
} from '../../../helpers/constants/design-system';
import Button from '../../ui/button';
import IconCaretLeft from '../../ui/icon/icon-caret-left';
import { useDispatch, useSelector } from 'react-redux';
import { getFrequentRpcListDetail, getUnapprovedConfirmations } from '../../../selectors';
import { MESSAGE_TYPE } from '../../../../shared/constants/app';
import { addCustomNetworks, requestUserApproval } from '../../../store/actions';
import Popover from '../../ui/popover';
import ConfirmationPage from '../../../pages/confirmation/confirmation';
import { FEATURED_RPCS } from '../../../../shared/constants/network';
import { ADD_NETWORK_ROUTE } from '../../../helpers/constants/routes';
import { isEmpty } from 'lodash';
import { useHistory, Redirect } from 'react-router-dom';

const AddNetwork = ({
  // onBackClick,
  // onAddNetworkClick,
  // onAddNetworkManuallyClick,
}) => {
  const t = useContext(I18nContext);
  const dispatch = useDispatch();
  const history = useHistory();
  const frequentRpcList = useSelector(getFrequentRpcListDetail);

  const frequentRpcListChainIds = frequentRpcList.map(net => net.chainId);

  const nets = FEATURED_RPCS
    .sort((a, b) => (a.ticker > b.ticker ? 1 : -1))
    .slice(0, FEATURED_RPCS.length);
    
  // const notFrequentRpcNetworks = nets.filter((net) => frequentRpcListChainIds.indexOf(net.chainId) === -1)
  const notFrequentRpcNetworks = [];
  // const onAddNetworkClick = async (item) => {
  //   console.log(item);
  //   dispatch(addCustomNetworks())
  // }
  const unapprovedConfirmations = useSelector(getUnapprovedConfirmations);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    const anAddNetworkConfirmationFromMetaMaskExists = unapprovedConfirmations.find(confirmation => {
      return confirmation.origin === 'metamask' && confirmation.type === MESSAGE_TYPE.ADD_ETHEREUM_CHAIN;
    })
    if (!showPopover && anAddNetworkConfirmationFromMetaMaskExists) {
      setShowPopover(true);
    }
  }, [unapprovedConfirmations, showPopover]);

  return (
    <>
    {isEmpty(notFrequentRpcNetworks) ? (
      <Box>
        <Box>
          <img
            src='images/info-fox.svg'
          />
        </Box>
        <Box>
          {t('youHaveAddedAll')}{' '}
          <Button type='link' className='add-network__link' onClick={() => <Redirect to={{ pathname: 'https://chainlist.org/' }} /> }>
            {t('here')}{'.'}
          </Button>
          {' '}{t('orYouCan')}{' '}
          <Button type="link" className='add-network__link'>
            {t('addMoreNetworks')}{'.'}
          </Button>
        </Box>
      </Box>
    ) : (
    <Box>
      <Box
        height={BLOCK_SIZES.TWO_TWELFTHS}
        padding={[4, 0, 4, 0]}
        display={DISPLAY.FLEX}
        alignItems={ALIGN_ITEMS.CENTER}
        flexDirection={FLEX_DIRECTION.ROW}
        className="add-network__header"
      >
        <IconCaretLeft
          aria-label={t('back')}
          // onClick={onBackClick}
          className="add-network__header__back-icon"
        />
        <Typography variant={TYPOGRAPHY.H3} color={COLORS.TEXT_DEFAULT}>
          {t('addNetwork')}
        </Typography>
      </Box>
      <Box
        height={BLOCK_SIZES.FOUR_FIFTHS}
        width={BLOCK_SIZES.TEN_TWELFTHS}
        margin={[0, 6, 0, 6]}
      >
        <Typography
          variant={TYPOGRAPHY.H6}
          color={COLORS.TEXT_ALTERNATIVE}
          margin={[4, 0, 0, 0]}
        >
          {t('addFromAListOfPopularNetworks')}
        </Typography>
        <Typography
          variant={TYPOGRAPHY.H7}
          color={COLORS.TEXT_MUTED}
          margin={[4, 0, 3, 0]}
        >
          {t('customNetworks')}
        </Typography>
        {notFrequentRpcNetworks.map((item, index) => (
          <Box
            key={index}
            display={DISPLAY.FLEX}
            alignItems={ALIGN_ITEMS.CENTER}
            marginBottom={6}
          >
            <img
              className="add-network__token-image"
              src={item?.rpcPrefs?.imageUrl}
              alt={t('logo', [item.ticker])}
            />
            <Typography variant={TYPOGRAPHY.H7} color={COLORS.TEXT_DEFAULT}>
              {item.ticker}
            </Typography>
            <i
              className="fa fa-plus add-network__add-icon"
              onClick={async () => {
                // dispatch(addCustomNetworks(item));
                await dispatch(requestUserApproval(item))
              }}
              title={`${t('add')} ${item.ticker}`}
            />
          </Box>
        ))}
      </Box>
      <Box
        height={BLOCK_SIZES.ONE_TWELFTH}
        padding={[4, 4, 4, 4]}
        className="add-network__footer"
      >
        <Button type="link" onClick={
          (event) => {
            event.preventDefault();
            global.platform.openExtensionInBrowser(ADD_NETWORK_ROUTE);
          }
        }>
          <Typography variant={TYPOGRAPHY.H6} color={COLORS.PRIMARY_DEFAULT}>
            {t('addANetworkManually')}
          </Typography>
        </Button>
        <ActionableMessage
          type="warning"
          message={
            <>
              {t('onlyInteractWith')}
              <a
                href="https://metamask.zendesk.com/hc/en-us/articles/4417500466971"
                target="_blank"
                className="add-network__footer__link"
                rel="noreferrer"
              >
                {t('endOfFlowMessage9')}
              </a>
            </>
          }
          iconFillColor="var(--color-warning-default)"
          useIcon
          withRightButton
        />
      </Box>
    </Box>
    )}
    {showPopover && <Popover>
      <ConfirmationPage />
    </Popover>}
    </>
  );
};

AddNetwork.propTypes = {
  // onBackClick: PropTypes.func,
  // onAddNetworkClick: PropTypes.func,
  // onAddNetworkManuallyClick: PropTypes.func,
};

export default AddNetwork;
