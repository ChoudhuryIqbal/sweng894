﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using source.Models;
using source.Queries;

namespace source.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {

        IEventQuery _eventQuery { get; set; }


        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="query">IEventQuery object handled by dependency injection</param>
        public EventController(IEventQuery query)
        {
            _eventQuery = query;
        }

        /// <summary>
        /// Returns All Events for a given username
        /// </summary>
        /// <param name="username">The username of which all events belong.</param>
        [HttpGet("{username}")]
        public async Task<IActionResult> Get(string username)
        {
            var result = await _eventQuery.GetAllEventsByUser(username);
            if (result == null)
                return new NotFoundResult();

            return new OkObjectResult(result);
        }

        /// <summary>
        /// Returns one Event given a username and eventId
        /// </summary>
        /// <param name="username">The username of which all events belong.</param>
        /// <param name="eventId">The unique id of a given Event</param>
        [HttpGet("{username}/{eventId}")]
        public async Task<IActionResult> Get(string username, int eventId)
        {
            var result = await _eventQuery.GetEventById(eventId);

            if (result == null)
                return new NotFoundResult();

            return new OkObjectResult(result);
        }

        /// <summary>
        /// Creates a new event in the database
        /// </summary>
        /// <param name="evnt">The Event to insert into the database.</param>
        [HttpPost]
        public async Task<IActionResult>Create([FromBody]Event evnt)
        {
            await _eventQuery.CreateEvent(evnt);
            return new OkObjectResult(evnt);
        }

        /// <summary>
        /// Enables a user to update the eventName, eventDescription and eventDateTime
        /// </summary>
        /// <param name="evnt"></param>
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Event evnt)
        {
            await _eventQuery.UpdateEvent(evnt);
            return new OkObjectResult(evnt);
        }

        /// <summary>
        /// Deletes the event.
        /// </summary>
        /// <returns>The event.</returns>
        /// <param name="eventId">Event identifier.</param>
        [HttpDelete("{eventId}")]
        public async Task<IActionResult> Delete(int eventId)
        {
            var result = await _eventQuery.GetEventById(eventId);

            if (result == null)
                return new NotFoundResult();

            return new OkObjectResult(await _eventQuery.DeleteEvent(result));
        }
    }
}
