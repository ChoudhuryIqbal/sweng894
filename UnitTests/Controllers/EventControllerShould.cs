﻿using System.Threading.Tasks;
using Moq;
using source.Queries;
using Xunit;
using System.Collections.Generic;
using source.Controllers;
using Microsoft.AspNetCore.Mvc;
using source.Models;
using System;
using source.Database;

namespace UnitTests.Controllers
{
    public class EventControllerShould
    {
        // System Under Test
        readonly EventController _evntController;
        readonly Mock<IEventQuery> __eventQueryMock;

        public EventControllerShould()
        {
            __eventQueryMock = new Mock<IEventQuery>();

            _evntController = new EventController(__eventQueryMock.Object);
        }

        [Fact]
        public void GetAllEventsByUser_ReturnEvents()
        {

            //arrange
            var evt1 = new Event { eventId = 1, userName = "jss94", description = "event description!" };
            var evt2 = new Event { eventId = 2, userName = "jss94", description = "event description two!" };
            var evt3 = new Event { eventId = 3, userName = "jss94", description = "event description three!!" };
            var evts = new List<Event> { evt1, evt2, evt3 };

            //act
            __eventQueryMock.Setup(x => x.GetAllEventsByUser("jss94"))
                .Returns(Task.Factory.StartNew(() => evts));

            var task = _evntController.Get("jss94");

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var eventsResult = result.Value as List<Event>;
            Assert.Equal(eventsResult[2].description, evts[2].description);
            Assert.Equal(eventsResult[2].userName, evts[2].userName);
            Assert.Equal(eventsResult[2].eventId, evts[2].eventId);

        }

        [Fact]
        public void GetOneEventById_ReturnOneEvent()
        {

            //arrange
            var evt2 = new Event { eventId = 2, userName = "jss94", description = "event description two!" };

            //act
            __eventQueryMock.Setup(x => x.GetEventById(2))
                .Returns(Task.Factory.StartNew(() => evt2));

            var task = _evntController.Get("jss94", 2);
            
            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var eventsResult = result.Value as Event;
            Assert.Equal(evt2.description, eventsResult.description);
            
        }

        [Fact]
        public void CreateNewEvent()
        {

            //arrange
            var evt2 = new Event { eventId = 0, userName = "jss94", description = "mock test data event" };

            //act
            __eventQueryMock.Setup(x => x.CreateEvent(evt2))
                .Returns(Task.Factory.StartNew(() => evt2));

            var task = _evntController.Create(evt2);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var eventResult = result.Value as bool?;
            Assert.True(eventResult);

        }

        [Fact]
        public void UpdateEvent_ReturnsEvent()
        {
            // arrange
            var evnt = new Event { eventId = 123, name = "Surprise Party", description = "Lets throw a surprise party for John!" };

            __eventQueryMock.Setup(x => x.UpdateEvent(evnt))
                .Returns(Task.Factory.StartNew(() => evnt));

            // act
            var task = _evntController.Update(evnt);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var eventResult = result.Value as Event;
            Assert.Equal(evnt, eventResult);
        }

        [Fact]
        public void DeleteEvent_ReturnEvent()
        {
            // arrange
            var evnt = new Event { 
                eventId = 123, 
                name = "Surprise Party", 
                description = "Lets throw a surprise party for John!"
                };
                
            __eventQueryMock.Setup(x => x.GetEventById(evnt.eventId))
                .Returns(Task.Factory.StartNew(() => evnt));

            __eventQueryMock.Setup(x => x.DeleteById(evnt.eventId))
                .Returns(Task.Factory.StartNew(() => true));

            // act
            var task = _evntController.Delete(evnt.eventId);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var usersResult = result.Value as bool?;
            Assert.True(usersResult);
        }



    }
}
