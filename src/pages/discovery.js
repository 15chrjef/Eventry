import React, { useState, useEffect } from 'react';
import { Block } from 'baseui/block';
import { useHistory } from 'react-router-dom';
import Button from '../components/button';
import Input from '../components/input';
import {
  Display4,
  Label2,
} from 'baseui/typography';
import { useStyletron } from 'styletron-react';
import ChevronLeft from 'baseui/icon/chevron-left';
import ChevronRight from 'baseui/icon/chevron-right';
import DiscoveryMap from '../components/map/discovery-map';
import HeaderNavigation from '../components/header-navigation';
import VenueCell from '../components/venue/venue-cell';
import { venues as allVenues } from '../constants/locations';
import { useDebounce, useQueryUrl, useGA } from '../utils';

// Filter
import Checkbox from '../components/checkbox';
import Select from '../components/filter-select';

const groupSizeOptions = [
  {
    id: 'none',
    label: 'Group Size'
  },
  {
    id: 1,
    label: '2 - 10'
  },
  {
    id: 2,
    label: '10 - 20'
  },
  {
    id: 3,
    label: '20 - 50'
  },
  {
    id: 4,
    label: '50+'
  }
];

const typeOptions = [
  {
    id: 'none',
    label: 'Activity Type'
  },
  {
    id: 'competitive',
    label: 'Competitive'
  },
  {
    id: 'cooperative',
    label: 'Cooperative'
  },
  {
    id: 'bar',
    label: 'Bar'
  },
  {
    id: 'explore',
    label: 'Explore'
  },
  {
    id: 'class',
    label: 'Class'
  },
  {
    id: 'tour',
    label: 'Tour'
  },
  {
    id: 'food',
    label: 'Food'
  }
];

const durationOptions = [
  {
    id: 'none',
    label: 'Duration'
  },
  {
    id: 1,
    label: '1 hour or less'
  },
  {
    id: 2,
    label: '1 - 3 hours'
  },
  {
    id: 3,
    label: '3+ hours'
  }
];

const budgetOptions = [
  {
    id: 'none',
    label: 'Budget Per Person'
  },
  {
    id: 1,
    label: '$20 or less'
  },
  {
    id: 2,
    label: '$20 to $50'
  },
  {
    id: 3,
    label: '$50 to $100'
  },
  {
    id: 4,
    label: 'More than $100'
  }
];


function SearchBar({ filterValue, updateFilterValue }) {
  const [ searchTerm, setSearchTerm ] = useState(filterValue.searchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(
    () => {
      updateFilterValue({
        searchTerm: debouncedSearchTerm
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearchTerm]
  );

  return (
    <Block width={['100%', '100%', '300px', '300px']}>
      <Input
        value={searchTerm}
        onChange={e => {
          setSearchTerm(e.target.value);
        }}
        placeholder="Search Venue"
      />
    </Block>
  );
}

function Filter({ venueCount, filterValue, updateFilterValue }) {
  return (
    <Block display="flex" flexDirection="column">
      <Block display="flex" alignItems="center" flexWrap="wrap" padding="12px">
        <Block padding="6px">
          <Select
            options={groupSizeOptions}
            value={filterValue.recommendedGroupsize}
            placeholder="Group Size"
            onChange={option => updateFilterValue({ recommendedGroupsize: option.id })}
          />
        </Block>
        <Block padding="6px">
          <Select
            options={typeOptions}
            value={filterValue.type}
            placeholder="Activity Type"
            onChange={option => updateFilterValue({ type: option.id })}
          />
        </Block>
        <Block padding="6px">
          <Select
            options={budgetOptions}
            value={filterValue.price}
            placeholder="Budget Per Person"
            onChange={option => updateFilterValue({ price: option.id })}
          />
        </Block>
        <Block padding="6px">
          <Select
            options={durationOptions}
            value={filterValue.duration}
            placeholder="Duration"
            onChange={option => updateFilterValue({ duration: option.id })}
          />
        </Block>
        <Block padding="6px">
          <Checkbox
            checked={filterValue.indoor}
            overrides={{
              Checkmark: {
                style: {
                  borderBottomRightRadius: '5px !important',
                  borderTopRightRadius: '5px !important',
                  borderBottomLeftRadius: '5px !important',
                  borderTopLeftRadius: '5px !important',
                }
              }
            }}
            onChange={e => updateFilterValue({ indoor: e.target.checked })}
          >
            Indoor
          </Checkbox>
        </Block>
        <Block padding="6px">
          <Checkbox
            checked={filterValue.outdoor}
            onChange={e => updateFilterValue({ outdoor: e.target.checked })}
            overrides={{
              Checkmark: {
                style: {
                  borderBottomRightRadius: '5px !important',
                  borderTopRightRadius: '5px !important',
                  borderBottomLeftRadius: '5px !important',
                  borderTopLeftRadius: '5px !important',
                }
              }
            }}
          >
            Outdoor
          </Checkbox>
        </Block>
        <Block padding="6px">
          <Label2 color="#484848"><b>{venueCount} results</b></Label2>
        </Block>
      </Block>
    </Block>
  );
}

function filterVenues(venues, filterValue) {
  return venues.filter(venue => {
    if (filterValue.price && filterValue.price !== 'none') {
      // $20 or less
      if (filterValue.price === 1 && venue.price > 20) {
        return false;
      }
      // $20 to $50
      if (filterValue.price === 2 && (venue.price < 20 || venue.price > 50)) {
        return false;
      }
      // $50 to $100
      if (filterValue.price === 3 && (venue.price < 50 || venue.price > 100)) {
        return false;
      }
      // More than $100
      if (filterValue.price === 4 && venue.price < 100) {
        return false;
      }
    }

    if (filterValue.recommendedGroupsize && filterValue.recommendedGroupsize !== 'none') {
      if (filterValue.recommendedGroupsize === 1 && venue.recommendedGroupsize[0] > 10) {
        return false;
      } else if (filterValue.recommendedGroupsize === 2 && (venue.recommendedGroupsize[1] < 10 || venue.recommendedGroupsize[0] > 20)) {
        return false;
      } else if (filterValue.recommendedGroupsize === 3 && (venue.recommendedGroupsize[1] < 20 || venue.recommendedGroupsize[0] > 50)) {
        return false;
      } else if (filterValue.recommendedGroupsize === 4 && venue.recommendedGroupsize[1] < 50) {
        return false;
      }
    }

    if (filterValue.duration && filterValue.duration !== 'none') {
      // 1 hour or less
      if (filterValue.duration === 1 && venue.averageTimeSpent > 60) {
        return false;
      }
      // 1 - 3
      if (filterValue.duration === 2 && (venue.averageTimeSpent < 60 || venue.averageTimeSpent > 180)) {
        return false;
      }
      // 3+
      if (filterValue.duration === 3 && venue.averageTimeSpent < 180) {
        return false;
      }
    }
    if (filterValue.type !== 'none' && filterValue.type && venue.activityType !== filterValue.type) {
      return false;
    }
    if (!filterValue.indoor || !filterValue.outdoor) {
      if (filterValue.indoor && venue.tags.indexOf('indoor') === -1) {
        return false;
      }
      if (filterValue.outdoor && venue.tags.indexOf('outdoor') === -1) {
        return false;
      }
    }
    if (filterValue.searchTerm) {
      if (
        !venue.description.toLowerCase().includes(filterValue.searchTerm.toLowerCase()) &&
        !venue.teaserDescription.toLowerCase().includes(filterValue.searchTerm.toLowerCase()) &&
        !venue.name.toLowerCase().includes(filterValue.searchTerm.toLowerCase())
      ) {
        return false;
      }
    }

    return true;
  });
}

const LIST_SIZE = 10;

const generateGALabel = (action, value) => {
  if (action === 'type') {
    return value;
  }
  if ((action === 'indoor' || action === 'outdoor') && !value) {
    return `${action} off`
  }
  if (action === 'recommendedGroupsize') {
    return groupSizeOptions.find(d => d.id === value).label;
  }
  if (action === 'duration') {
    return durationOptions.find(d => d.id === value).label;
  }
  if (action === 'price') {
    return budgetOptions.find(d => d.id === value).label;
  }
  return '';
};

const emitFilterEvent = (payload, ga) => {
  const action = Object.keys(payload)[0];
  const label = generateGALabel(action, payload[action]);
  ga.event({
    category: 'Filter',
    action,
    label
  });
};

function initializeFilter(queryUrl) {
  const indoor = queryUrl.get('indoor');
  const outdoor = queryUrl.get('outdoor');
  const price = queryUrl.get('price');
  const duration = queryUrl.get('duration');
  const type = queryUrl.get('type');
  const groupSize = queryUrl.get('groupSize');
  const searchTerm = queryUrl.get('searchTerm');
  return {
    price: !isNaN(price) ? Number(price) : null,
    recommendedGroupsize: !isNaN(groupSize) ? Number(groupSize) : null,
    duration: !isNaN(duration) ? Number(duration) : null,
    type: type ? type : null,
    indoor: indoor === 'false' ? false : true,
    outdoor: outdoor === 'false' ? false : true,
    searchTerm: searchTerm ? searchTerm : ''
  };
}

function setFilterQueryUrl(history, queryUrl, payload) {
  const action = Object.keys(payload)[0];
  if (payload[action] === 'none') {
    queryUrl.delete(action);
    if (action === 'recommendedGroupsize') {
      queryUrl.delete('groupSize');
    }
  } else if (action === 'indoor') {
    if (action === 'indoor' && !payload[action]) {
      queryUrl.set('indoor', 'false');
    }
    if (action === 'indoor' && payload[action]) {
      queryUrl.delete('indoor');
    }
  } else if (action === 'outdoor') {
    if (action === 'outdoor' && !payload[action]) {
      queryUrl.set('outdoor', 'false');
    }
    if (action === 'outdoor' && payload[action]) {
      queryUrl.delete('outdoor');
    }
  } else if (action === 'recommendedGroupsize') {
    queryUrl.set('groupSize', payload[action]);
  } else if (action === 'searchTerm') {
    if (payload[action]) {
      queryUrl.set('searchTerm', payload[action]);
    } else {
      queryUrl.delete('searchTerm');
    }
  } else {
    queryUrl.set(action, payload[action]);
  }
  history.push({
    pathname: '',
    search: queryUrl.toString()
  });
}

export default function Discovery() {
  const ga = useGA();
  const [ css ] = useStyletron();
  const history = useHistory();
  const queryUrl = useQueryUrl();
  const [ venueRefs, setVenueRefs ] = useState({});
  const [ largeMap, setLargeMap ] = useState(false);
  const [ venueIndex, setVenueIndex ] = useState(0);
  const [ scrollToId, setScrollToId ] = useState(null);
  const [ venues, setVenues ] = useState(allVenues);
  const [ hoveredVenueId , setHoveredVenueId ] = useState(null);
  const [ filterValue , setFilterValue ] = useState(initializeFilter(queryUrl));

  useEffect(() => {
    document.title = `TeamBright`;
    setVenues(filterVenues(allVenues, filterValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setVenueRefs(venues.slice(venueIndex, venueIndex + LIST_SIZE).reduce((acc, venue) => {
      acc[venue.id] = React.createRef();
      return acc;
    }, {}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueIndex]);

  useEffect(() => {
    if (scrollToId !== null && venueRefs[scrollToId] && venueRefs[scrollToId].current) {
        venueRefs[scrollToId].current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        setScrollToId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueRefs[scrollToId] && venueRefs[scrollToId].current]);

  const updateFilterValue = (payload) => {
    setFilterQueryUrl(history, queryUrl, payload);
    emitFilterEvent(payload, ga);
    setFilterValue({
      ...filterValue,
      ...payload
    });
    setVenues(filterVenues(allVenues, {
      ...filterValue,
      ...payload
    }));
    setVenueIndex(0);
    setScrollToId(null);
  };

  const onVenueClicked = (id) => {
    if (venueRefs[id] && venueRefs[id].current) {
      venueRefs[id].current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      let index = 0;
      venues.forEach((v, i) => {
        if (v.id === id) {
          index = i;
        }
      });
      setScrollToId(id);
      setVenueIndex(Math.floor(index / 10) * 10);
    }

  };

  const handlePrevPage = () => {
    if (venueIndex !== 0) {
      setVenueIndex(venueIndex - LIST_SIZE);
    }
  };

  const handleNextPage = () => {
    if (venueIndex + LIST_SIZE <= venues.length) {
      setVenueIndex(venueIndex + LIST_SIZE);
    }
  };

  const slicedVenues = venues.slice(venueIndex, venueIndex + LIST_SIZE);

  return (
    <Block display="flex" flexDirection="column" height={['auto', 'auto', '100vh', '100vh']}>
      <HeaderNavigation>
        <SearchBar filterValue={filterValue} updateFilterValue={updateFilterValue} />
      </HeaderNavigation>
      <Block>
        <Filter
          filterValue={filterValue}
          updateFilterValue={updateFilterValue}
          venueCount={venues.length}
        />
      </Block>
      <Block display="flex" flexDirection={["column", "column", "row", "row"]} flex="1 1 auto" overflow={["initial", "initial", "auto", "auto"]}>
        <Block position="relative" flex={largeMap ? "2" : "1"} display={["none", "none", "initial", "initial"]}>
          <Block
            className={css({
              position: 'absolute',
              right: '12px',
              top: '12px',
              zIndex: 1
            })}
          >
            {largeMap && <Button size="compact" backgroundColor="#4284F2" color="#fff" onClick={() => setLargeMap(false)}><ChevronLeft /> Reduce Map</Button>}
            {!largeMap && <Button size="compact" backgroundColor="#4284F2" color="#fff" onClick={() => setLargeMap(true)}>Large Map <ChevronRight /></Button>}
          </Block>
          <DiscoveryMap venues={venues} hoveredVenueId={hoveredVenueId} setHoveredVenueId={setHoveredVenueId} onVenueClicked={onVenueClicked} />
        </Block>
        {
          venues.length ?
          <Block flex={!largeMap ? "2" : "1"} display="flex" flexDirection="column" overflow="auto">
            <Block display="flex" flexWrap="wrap">
            {
              slicedVenues.map((venue, index) => {
                return (
                  <Block
                    flex={largeMap ? "0 1 100%" : "0 1 calc(50% - 24px)"}
                    margin="12px"
                    ref={venueRefs[venue.id]}
                    key={venue.id}
                    className={css({
                      opacity: hoveredVenueId === venue.id ? 0.8 : 1,
                      cursor: 'pointer'
                    })}
                    onMouseLeave={() => { setHoveredVenueId(null) }}
                    onMouseEnter={() => { setHoveredVenueId(venue.id) }}
                  >
                    <a href={`/${venue.symbol}`} rel="noopener noreferrer" target="_blank" className={css({ textDecoration: 'none' })}>
                      <VenueCell venue={venue} hovered={hoveredVenueId === venue.id} />
                    </a>
                  </Block>
                );
              })
            }
            </Block>
            <Block display="flex" width="100%" alignItems="center">
              <Block flex="1" display="flex" flexDirection="column">
                <Button kind="minimal" onClick={handlePrevPage}>
                  <ChevronLeft size={36} /> <b>{Math.floor(venueIndex / 10) ? Math.floor(venueIndex / 10) : null}</b>
                </Button>
              </Block>
              <Block>
                <b>{Math.floor(venueIndex / 10) + 1}</b>
              </Block>
              <Block flex="1" display="flex" flexDirection="column">
                {
                  (venueIndex + LIST_SIZE) <= venues.length &&
                  <Button kind="minimal" onClick={handleNextPage}>
                    <b>{Math.floor(venueIndex / LIST_SIZE) + 2}</b> <ChevronRight size={36} />
                  </Button>
                }
              </Block>
            </Block>
          </Block> :
          <Block flex={!largeMap ? "2" : "1"} display="flex" backgroundColor="#F4F4F4" alignItems="center" justifyContent="center">
            <Display4><b>No Result</b></Display4>
          </Block>
        }
      </Block>
    </Block>
  );
}
