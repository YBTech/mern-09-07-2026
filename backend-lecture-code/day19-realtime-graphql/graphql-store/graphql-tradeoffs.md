<reddit-reply>
Initial toolset early on wasn't great and there was tons of problems to solve. Those problems have mostly been solved by now, but the public opinion doesn't change very quickly.

Facebook pushing Relay hard, made a segment of the community believe it was "the" way to do GraphQL, yet docs and support wasn't super great.

Same as the above, but with Apollo.

Finally and in my experience, most importantly, GraphQL has been positioned as a tech to make frontend better, with the burden on backend. It's not really true in practice, but the backend community generally doesn't know the ins and outs of GQL as well. It ends up with a sentiment that GQL lets you "do whatever you want with the data", has perf issues, is less secure, and generally is like "exposing SQL to the frontend". That's all incorrect, but it's been pretty pervasive in the greater community.

I went back and forth between GQL and other techs (REST, gRPC, etc), and my latest org recently did a migration to GraphQ. With modern tooling and practice, it's been quite lovely.

2

2 more replies
u/PM_ME_SCIENCEY_STUFF avatar
PM_ME_SCIENCEY_STUFF
•
2y ago
Most of the criticisms I see here are valid.

That said, if you use Hasura + Relay, I think you'll have an amazing experience (I don't work for Hasura, and there are other options: Wundergraph, The Guild, Grafbase, etc. but from my last check, Hasura has the most Relay-centric features) Good tools shouldn't need extra help like this, but so be it.

Hasura alleviates most of the backend problems mentioned in other responses, and Relay does the same for the frontend. My team builds about 4x faster than we used to with REST.

Edit: I'll also note Facebook is in the process of rebuilding everything with Relay + GraphQL. Install the Relay Developer Tools Chrome extension, go to FB, open dev tools and check out the Relay tab; very interesting to see all the data in the relay store and gives you some idea of how it works at scale.

2

1 more reply
u/difficultyrating7 avatar
difficultyrating7
•
2y ago
tons of complexity and room for error that usually outweighs benefits

client devs get lazy and share query fragments? now you’re over fetching everywhere.

most of the time gql composes backend RPC services which don’t support any kind of predicate push down, and so you’re still overfetching from storage services.

when your gql composition layer gets big and doesn’t perform well the solution is to federate, which adds another layer of complexity

651
ElCthuluIncognito
•
2y ago
The best part is these drawbacks were well understood since day 0.

GQL existed primarily to minimize the data being sent over the wire in the last jump to mobile devices.

The rest of it was making the most of this ability, but it’s frustrating that people figured that because the end user interface is efficient its implementation could have some inherent efficiency too.

Leave it to the community to extrapolate gains in one context to the rest of the system. Tale as old as time.

112
DanteIsBack
•
2y ago
What does federate mean in this context?

95

13 more replies

18 more replies
u/Alikont avatar
Alikont
•
2y ago
It's hard to maintain on the server.

Your queries are now client-driven, which means that the query pattern can change at any time, and the query pattern might not be what back-end people anticipated.

Too much freedom to front-end, too much pain for back-end.

In my case it's just easier to, you know, talk to people and listen to what they need and design rest api around those needs.

327
Evinceo
•
2y ago
Engineers will literally demand a 'build your own query' kit instead of just talking to other engineers.

200

16 more replies

35 more replies
u/DogOfTheBone avatar
DogOfTheBone
•
2y ago
People hate it because it got adopted because it was trendy, not because it was a good solution to a problem they actually had.

It can be a very useful tool in a lot of use cases but replacing your internal REST API (or even better, sitting on top of your internal REST API and being a useless middleman) is generally not one of those, and that's what most people who tried it did.

138

10 more replies
Golandia
•
2y ago
It shines if you have many services and resources across them so you don’t need to make a ton of REST calls. If you aren’t operating at that scale, like at a large company, don’t bother. It adds overhead and complexity that you can just avoid. Using something simple like OpenAPI/Swagger will get you all the benefits of a well defined API with generable clients, servers and defined types on requests and responses without additional complexity.

32

4 more replies
C0git0
•
2y ago
It’s a fine way to have many api teams who own many services have some sort of consistency provided to application teams that need to consume them. 

Only the largest companies have this problem, most companies don’t. 

58
F0tNMC
•
2y ago
This. GraphQL is necessary if you have a significant number of domains that could benefit from presenting a uniform interface to clients. But if you don’t have that, it’s another layer of indirection and complexity which needs to be maintained in addition to your domains.

18

3 more replies
u/NickFullStack avatar
NickFullStack
•
2y ago
I've used it with Contentful, Shopify, and Umbraco. Those implementations left a bad taste in my mouth (there's also a TLDR at the bottom of this post):

The requirement to indicate in each request very single thing you might fetch from the API is annoying. If I'm fetching widgets that are editable, that might mean I have to indicate the structure of all 30 widgets in each request (along with all the sub-items they require, such as images and links). I don't even remember what I did for recursive structures (e.g., an FAQ item can contain arbitrary other widgets). Just let me fetch all widgets and I'll worry about enumerating the result.

On one system (Contentful?), it would throw an error if you didn't have at least one example of content that utilized a particular structure. So if I have a content link, media link, and overlay link, but I'm early in the dev process and don't have an example overlay link created as content yet, it'll just bomb out. Or even more annoying is when somebody deletes the one overlay link on prod and now the site won't build anymore for obscure reasons.

There are these arbitrary hidden limitations, such as query complexity. One even has a bulk API for more complexity, but it too has limits, leading to strange workarounds.

I can implement my own REST API, but implementing my own GraphQL API would be a real challenge.

With Umbraco, they only let you use GraphQL in their cloud environments, so now they have a way of forcing you to stick with their subscription products (otherwise, you can self host Umbraco).

For me, this was far too much annoyance for very little benefit.

TLDR: Too strict request structure requirements, too strict content presence requirements, limits like query complexity, difficult to build from scratch, forces cloud subscriptions.

25

3 more replies
Equivalent_Bet6932
•
2y ago
The GraphQL hype/hate is exactly the same as the microservices one. Facebook says: "Look at this cool tool that we created that is really nice for our large-corporation, complex product use-case". Then everyone was like "Hey, I have this tiny project with 5 people working on it, surely we should do the same thing as Facebook !".

Then, of course, because it is a tool designed for handling complex use-cases at large orgs, there is a ton of overhead and tons of opportunities to shoot yourself in the foot.
A lot of devs were the victims of some architect deciding that graphQL was the way to go, and just like modular monoliths are back as the default solutions for most applications, people are realizing that a Rest API is just fine for most use-cases. It's also the same thing NoSQL databases, where people are realizing that you should probably just use postgres in most situations.

All these things follow the same pattern. Large orgs that face difficult organizational or technical challenges at scale create complex (but useful !) tools to solve them, and engineers who work on products that are very, very far from that scale think that they should adopt these tools. Turns out, in most cases, it just destroys your productivity, and the better choice would have been to pick the simpler tool, build the project well and actually succeed with the product, then migrate to different tools as the need arises (with money from your working product to pay engineers capable of performing said migrations).

44
u/bobaduk avatar
bobaduk
•
2y ago
This! I've implemented a GraphQL API exactly once and it was awesome, because it fit the use case. Every other time I've built an API, plain ol' http or ReST has been a simpler fit.

Moreover, lots of people implement graphql because they've built a zillion tiny "services" that each store data on one entity, and it sucks to query them all one at a time. It would be better to ... not do that in the first place.

17

1 more reply
coleavenue
•
2y ago
The reason for the widespread shift is people have actually used it now. It's really easy to like something you haven't used and have only read about in a hype blog post.

Now that we've actually used GraphQL we're forced to acknowledge from bitter experience that it fucking sucks. Particularly as a backend dev, it adds literally no benefit, all the regular database scaling problems are still there, but now you have this other big layer of bullshit on top that only adds more problems.

143
u/Alikont avatar
Alikont
•
2y ago
Yeah, I think "I would like to use it again" is a great tech quality metrics.

52

7 more replies
rogorak
•
2y ago
GQL has it's uses, but it's efficiency can be outweighed by it's complexity in a large object graph.

If you don't understand how to split your resolvers for your use case you end up saving 100 bytes of network xfer but making 4 database calls in place of one.

Right tool for right job. All too often ppl are doing gql and fetching all fields all the time.

Also if you ever have a recursive object tree / payload of an unknown depth gql is terrible for it, as it was an intentional design choice not to support that inherently, at least last I checked.

If gql really fits your use case go for it. Otherwise I'd stick with rest if you're not sure.

14

4 more replies
u/_predator_ avatar
_predator_
•
2y ago
I'm thinking of it similarly as microservices vs monoliths. It doesn't solve a scalability or performance problem, it solves an organizational one. If you're a large org with lots of teams, it's less friction to offer a generic interface such as GQL than to have a frontend team blocked because a REST endpoint doesn't include a specific field. In some orgs it takes weeks to months for such a simple addition to make it to prod.

That said, I won't touch GQL for the life of me, and I will argue against introducing it every time. But I also haven't worked on projects that necessitate it organizationally.

40
u/Alikont avatar
Alikont
•
2y ago
"Organizations build software that reflects their management structure"

20

2 more replies
[deleted]
•
2y ago
I love it.  I think it’s a great fit for when there are multiple front ends that need different results.  I hate over fetching.  It also lets me be explicit about the domain operations in a natural way.  And the explicit typing on server and client sides is self-documenting, and now I don’t need to write a type library for what the required and optional fields are.

It has some downsides.  It steers you towards a N+1 design if you don’t know what you’re doing.  A lot of the commercial offering suggest generating the api straight from your database which removes the benefit of modeling your domain.  If you allow for arbitrarily nested queries you’re asking for a DoS attack.

I’ve found that the negatives are easily avoided and the benefits make up for it.  I don’t use it for everything.  Sometimes a remote service just needs a tiny POST endpoint and graphql is overkill.  But for my main API, I think it’s great.

16
u/kbn_ avatar
kbn_
•
2y ago
I've written a giant treatise on this for my org.

The short answer is that GraphQL, particularly with graph federation, is one of those ideas that seems amazing and feels like it solves a ton of problems very elegantly, but in practice it ends up being awful for both technical and organizational reasons, and it metastasizes in a way which defeats almost any effort to remove it after the fact.

The tldr on why this is the case comes down to how much it empowers frontend developers to get the data they need, and only the data they need, without going through a backend dev loop, and without increasing their perceived costs (i.e. no extra round-tripping or client memory footprint). Unfortunately, it achieves this by effectively exposing the backend distributed system as a distributed system and allowing clients to compose joins and non-linear access patterns across the whole graph. This makes the load patterns almost impossible to bound or predict, which in turn makes backend scaling and SLAs kind of meaningless in the limit. It also has a tendency to expose storage representation all the way through to clients (though it doesn't strictly need to), which makes storage refactoring and migration even harder.

But of course, since this type of empowerment is all upside for one team (frontend) with the costs externalized to another team (backend), it becomes a political nightmare to put the genie back in the bottle. It also touches on the hardest things to deliver incrementally (breaking changes to data schemas and APIs), and it has deep, significant, and unexpected performance implications that absolutely will show up at the worst possible moments.

Ultimately, like all technologies, it does have its uses, but it is far less generally applicable than its proponents assert. It generally fits very well bounded within a single organization managing a large number of services, where each service is managed by a different team and they all compose into a single (very complex) surface area from the perspective of the clients. GraphQL can be very useful here as an implementation detail of this service network: every service becomes part of the federated graph, and then you toss a gateway orchestrator service on top of all of it. That gateway orchestrator is the GraphQL client, and then it exposes a gRPC or REST API to the frontend. If needed, this space can be jointly maintained by frontend and backend devs, since it's effectively a very complex BFF, but the joint part of joint ownership is very important here: backend devs need to be the ones maintaining and approving the GraphQL queries in this type of architecture, not frontend.

14
[deleted]
•
2y ago
A lot of people I see implement graphql... Stick it on top of a poco architecture where its loading whole objects anyways.

The client api wyipl ask for one field from User and the back end API will pull the entire model and then give them that one field.

It's a lazy implementation that adds no benefit.

If you're going to implement graphql you need a patachable api. If the client asks for one field, you should only be pulling one field from the database.

If the client updates three fields, you should only be updating three Fields from the database.

But most often what they'll do is they'll pull the whole object, then set those three Fields, then save the whole object.

You've gained basically nothing.

Unless mostly comes from the fact that people stick some orm between the two and that's how the orm works.

Graphql is great, if the backend properly supports it, and devs don't usually do that.

This is why I don't generally use entity framework on sql server projects.

Ill use ssdt db projects in visual stuidio. Will deploy and update the database with dacpacs. Then put graphql right on the service layer and use petapoco as a micro orm.

Its better and more source control friendly.

And for service to service on the backend we use grpc.

And as soon as browsers natively support bi-directional grpc it's going to change how everybody does apis.

7
indiealexh
•
2y ago
Mostly because people don't use it for its purpose, and the end result is very messy.

I don't hate GraphQL but when it's not used where it should be, it adds complexity for no benefit, so I am immediately cautious.

6

1 more reply
u/defmacro-jam avatar
defmacro-jam
•
2y ago
I am suspicious because I don't want people to run unanticipated queries against my database, which has been indexed properly according to its anticipated uses.

61

14 more replies
u/PhatOofxD avatar
PhatOofxD
•
2y ago
Because as with this entire industry, when it's hot people think you have to use it everywhere.

So tons of businesses used graphql where it shouldn't be used and it was horrible.

And now people hate it. See also: the infinite cycle of micro services/monolith


</reddit-reply>


<chat-gpt-response>
You should **not invent a GraphQL justification where there wasn’t one**. In an interview, a strong answer is often:

> “We evaluated the needs implicitly through our architecture. The application had a small number of browser-based internal consumers, stable screen requirements, and resource-oriented workflows. REST was simpler and sufficient. I would introduce GraphQL only if the API-composition and client-evolution costs became material.”

That shows better judgment than saying GraphQL should be everywhere.

That said, internal enterprise applications *can* have legitimate GraphQL use cases. The dividing line is not “internal vs. external” or “mobile vs. desktop.” It is whether the application has **many changing data views across multiple backend domains**.

## A plausible internal enterprise use case

Imagine an internal operations portal for a large company. A support agent opens a customer/account page and needs to see:

- identity and account status;
- contracts and subscription plan;
- invoices, payment failures, refunds;
- orders, shipment status, returns;
- entitlement/permissions;
- recent support tickets;
- audit history;
- risk or fraud flags.

Those data sets may come from 6–10 independently owned systems.

A REST BFF could absolutely provide:

```http
GET /support/customer-360/{customerId}
```

For one fixed customer-view screen, that is likely the best solution.

But perhaps the support organization has:

- first-line agents, who need a compact view;
- billing specialists, who need invoices and payment history;
- fulfillment staff, who need order/shipping details;
- compliance staff, who need identity and audit details;
- managers, who need metrics and queues;
- regional teams with different workflows;
- frequent feature flags and workflow changes.

If every variation requires a new BFF endpoint or another growing set of `include=` parameters, GraphQL can become reasonable:

```graphql
query CustomerSupportView($id: ID!) {
  customer(id: $id) {
    displayName
    accountStatus

    subscriptions {
      planName
      status
    }

    recentInvoices {
      invoiceNumber
      amount
      paymentStatus
    }

    openTickets {
      id
      priority
      status
    }
  }
}
```

A billing screen can ask for a different projection without requiring the API team to create a new endpoint:

```graphql
query BillingSpecialistView($id: ID!) {
  customer(id: $id) {
    invoices {
      invoiceNumber
      dueDate
      amount
      paymentStatus
      failedPaymentReason
    }
    refunds {
      id
      amount
      status
    }
  }
}
```

The value is **not** that the employee is on a mobile network. The value is reducing recurring work for a shared internal data-access layer as multiple teams need different views of the same cross-domain data.

## Internal scenarios where GraphQL can be credible

### 1. “Customer 360” / “Account 360” operations portal

This is probably the best enterprise example.

Support, sales, finance, compliance, and operations all look at the same customer or account, but each role needs a different subset of data. The backend data is distributed across many services.

GraphQL can provide a typed, governed read layer over those systems.

But if there is only one UI with a fixed screen, a REST BFF endpoint is still simpler.

---

### 2. Configurable dashboards and reports

An internal admin portal may allow users to configure dashboards:

- finance: revenue, aging invoices, refunds;
- operations: shipments, warehouse exceptions, fulfillment rate;
- HR: headcount, approvals, leave metrics;
- security: access anomalies and audit events.

If dashboards are predefined and few, REST endpoints work well.

If business users or frontend teams need to assemble many changing data views, GraphQL can avoid continuously adding narrowly tailored report endpoints. In reality, this may also require a dedicated reporting or analytics platform; GraphQL is not a replacement for a data warehouse.

---

### 3. A large internal platform with multiple frontends

“Internal” does not necessarily mean “one application.”

A large organization can have several browser-based internal applications:

- employee admin portal;
- support console;
- finance/reconciliation console;
- vendor-management portal;
- operations control center;
- compliance/audit tool.

They may all consume the same domains—customer, organization, identity, orders, invoices, permissions—but need different projections.

A GraphQL platform can be a shared contract for those frontend teams. That is similar to the multi-client benefit, except the “clients” are different internal web applications rather than iOS/Android/web.

---

### 4. Rapidly changing workflow-driven UI

Internal applications can change faster than consumer applications because they are built around evolving policies and processes:

- a compliance rule changes;
- a new approval step is introduced;
- a new fraud investigation field is required;
- an acquisition introduces another account system;
- a support team gets a new escalation workflow.

If those changes repeatedly require modifications to many REST endpoints, GraphQL can let frontend teams make limited read-shape changes independently—as long as the needed fields already exist in the schema and they are authorized to access them.

Important caveat: GraphQL does **not** eliminate backend work for new business capabilities. A new underlying field, relation, calculation, or authorization rule still needs backend implementation.

---

### 5. Data federation across legacy systems

This can be a real enterprise reason, although it must be approached carefully.

Many enterprises have a mixture of:

- legacy SOAP services;
- REST services;
- databases;
- vendor SaaS APIs;
- newer microservices;
- mainframe or ERP integrations.

A GraphQL gateway can provide one consistent query contract while resolvers adapt to the underlying systems. For frontend consumers, it can turn many incompatible APIs into a single typed schema.

However, GraphQL does not magically repair legacy-system latency, data quality, ownership, or reliability. It may also create a dangerous “god gateway” if the schema has no domain ownership or governance.

## A useful interview answer

You could say something like:

> “In my previous internal enterprise project, GraphQL was not necessary. We had a browser-based application, a limited number of internal consumers, predictable workflows, and stable resource-oriented APIs. REST was lower complexity and was the right tradeoff.
>
> I would consider GraphQL if the product evolved into a cross-domain operations portal—such as a customer-360 view—where several frontend teams repeatedly needed different combinations of data from orders, billing, support, identity, and entitlements. In that situation, a GraphQL BFF or federated gateway could reduce custom aggregation endpoint proliferation and provide a typed contract.
>
> I would still keep domain-service APIs REST or gRPC as appropriate, and use GraphQL primarily at the frontend-facing aggregation boundary. I would also account for query-cost limits, authorization at the field level, batching to prevent N+1 calls, and tracing/observability.”

That is credible because it does not claim that GraphQL was needed when it was not.

## What not to claim

Avoid weak reasons such as:

- “GraphQL is faster.”
- “GraphQL means fewer backend releases.”
- “GraphQL replaces microservices.”
- “GraphQL is always better for nested data.”
- “We use GraphQL because it avoids multiple API calls.”

All of those are incomplete or potentially false. REST can use aggregation endpoints, expansion, pagination, sparse fieldsets, caching, and purpose-built APIs. GraphQL is worthwhile only when its flexibility offsets its operational and implementation cost.

## Bottom line

For a typical internal enterprise CRUD/workflow system, your instinct is right:

> **REST is usually enough, and GraphQL may be unnecessary complexity.**

The strongest GraphQL use case in internal software is not mobile—it is a **shared, rapidly evolving, cross-domain read layer** serving many internal workflows or applications with substantially different data projections. If your past project did not have that pain, saying REST was the right choice is an informed and interview-worthy answer.

</chat-gpt-response>


