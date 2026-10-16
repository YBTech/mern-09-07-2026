# Q3 2026 Operations Review

This review covers July to September 2026. Each department reports on its quarter. Every incident gets its own tracking code, and an incident can be mentioned in more than one department's report.

## Section 1: Executive summary

Revenue grew 9% against the plan, led by headphone sales in Canada and the new student discount. Customer satisfaction stayed high despite one large incident in September. The team shipped the redesigned checkout, opened a second packing line, and agreed next year's pricing with the main supplier. Priorities for the next quarter are faster delivery to the United Kingdom, a simpler referral offer, and a shorter onboarding path for new support agents.

## Section 2: Warehouse and logistics

The Toronto warehouse processed 41,000 parcels, up 12% from the second quarter. Pick rates improved after the new shelving layout went live in July, and the night shift now clears the returns bin within one working day. A scanner outage on the packing line was logged as OPS-5530 and fixed within two hours. Overtime hours fell by a fifth. A second packing line opens in November, ahead of the winter peak, and the team will hire six seasonal workers to staff it.

## Section 3: Software engineering

The mobile app moved to the new design system, and the checkout page now loads 30% faster. Engineers removed two unused libraries, fixed a crash on older phones, and raised test coverage to 78%. The most serious defect of the quarter was a pairing bug introduced by firmware 2.4.0, which made Bluetooth connections drop within minutes. Root cause analysis traced it to a timing error in the pairing module and is documented under INC-2026-Q3-011. Firmware 2.4.1 fixed the problem in August, and the team added a pairing test to every release. The next sprint focuses on the order history screen.

## Section 4: Customer support

The support team answered 94% of chats within five minutes, and the satisfaction score held at 4.6 out of 5. The most common questions were about opened-item returns, delivery times, and promotion codes. In August, chat volume doubled for ten days because of the Bluetooth drop, and agents handled around 3,800 extra conversations related to INC-2026-Q3-011. Two new agents finished training, and a new macro library cut the average reply time by 40 seconds. Hiring for the winter season starts in October.

## Section 5: Finance review

Revenue for the quarter grew 9% against the plan. Card processing fees rose slightly because of the larger share of international orders, and the refund rate stayed below 4%. The pairing incident INC-2026-Q3-011 cost an estimated $212,000 in extra support hours, replacement headphones, and shipping, which is about 1.4% of quarterly revenue. Spending on cloud services was higher than forecast, so the team will remove unused resources and renegotiate the support contract before the year ends.

## Section 6: Security review

The annual penetration test found no critical issues, and the two medium findings about password rules were fixed within a week. All staff completed phishing training, and the click rate on test emails fell to 3%. A suspicious login from an unknown country was blocked and logged as SEC-4097, with no customer data accessed. The team will move all admin accounts to hardware security keys by December.

## Section 7: Marketing results

The summer campaign reached 1.2 million people, and the newsletter list grew by 6,000 subscribers. Student discounts brought the largest number of first orders. The referral program produced fewer sign-ups than planned, so the team will test a simpler offer. Social posts about the free repair programs received more replies than any other topic, and the October firmware release video was the most watched clip of the year.

## Section 8: Supplier management

The main headphone supplier delivered 98% of orders on time. A shipment of charging cases was delayed by a port strike and arrived two weeks late, which is tracked as SUP-8814 in the logistics log. The team added a second supplier for cases to reduce the risk. Pricing for next year was agreed with a small increase on leather ear cushions, and a quality audit of the speaker factory is planned for November.

## Section 9: Product quality

Return reasons were reviewed for every product. The Aria 500 had the highest rate of connection complaints before the firmware fix, and Pulse earphones had fewer charging case faults after the supplier change. The quality team added a battery test to the end of the production line and will report the results next quarter. A new squeak test was introduced for headband hinges after customer reports.

## Section 10: People and hiring

Three new engineers and one designer joined this quarter. The onboarding checklist was shortened, and new hires now ship a small change in their first week. Employee survey scores improved for workload and tools. The company will hire two more support agents, one data analyst, and six seasonal warehouse workers for the winter season.

## Section 11: Sustainability

Packaging weight fell by 14% after the switch to smaller boxes, and 92% of the packaging is now recycled paper. The trade-in program collected 3,200 used products, and all of their batteries went to a certified recycler. A plan to ship by rail instead of truck on the Toronto to Montreal route is under review and could start in the spring.
