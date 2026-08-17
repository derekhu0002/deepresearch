# 洞察业界 Agentic Engineering 的现状和趋势

> 工作包：洞察业界Agentic Engineering的现状和趋势（意图图谱元素 id 1327）
> 方法：麦肯锡结构化战略分析新5步法（意图图谱元素 1314）
> 日期：2026-08-17
> 约束：所有洞察结论都必须给出论据来源（URL 链接 + 原文段落）

---

## 1. 问题定义（SMART）

首先挑战问题本身：本工作包的标题「洞察业界Agentic Engineering的现状和趋势」若不做约束，会退化为泛泛的行业综述。按 SMART 原则将其收敛为可执行、可验收的问题：

- **Specific（具体的）**：识别业界构建 Agentic 系统的主流架构范式、编排/框架交付形态、工具与协议标准、评测与可观测、安全与治理、以及企业采用方向，并给出每个洞察的证据来源。
- **Measurable（可衡量的）**：交付一棵 ≥3 层的 MECE 决策树，附着 ≥1 个可证伪假设；每个假设给出唯一三态结论（supported / refuted / undetermined）；每个结论附带 URL 与原文段落。
- **Achievable（可实现的）**：基于公开权威互联网来源（Anthropic、Google、OpenAI、MCP 官方文档等）完成取证，不依赖仓库外无法取得的私有数据。
- **Relevant（相关的）**：服务于本仓库对 Agentic Engineering 现状与趋势的洞察需求，为后续意图/实现决策提供外部事实支撑。
- **Time-bound（有时限的）**：本洞察于 2026-08-17 完成并交付。

**Goal / Outcome / Course of Action**：

- Goal：获得一份有证据支撑的 Agentic Engineering 现状与趋势洞察。
- Outcome：一棵 ≥3 层 MECE 决策树 + 一组三态验证假设 + 带来源的趋势判断。
- Course of Action：按「能力栈 × 时间轴」展开取证，优先寻址反例，逐假设给出结论。

---

## 2. 决策树（MECE，≥3 层）

### 第1层：能力域（拆解维度：构建生产级 Agentic 系统的完整能力栈）

1. 模型与推理能力（Model & Reasoning）
2. 编排与框架（Orchestration & Frameworks）
3. 工具与协议（Tools & Protocols）
4. 评测与可观测（Evaluation & Observability）
5. 安全与治理（Safety & Governance）
6. 采用与生态（Adoption & Ecosystem）

**MECE 论证**：这六个域以「构建并运行一个生产级 Agentic 系统所需的完整能力」为母集进行切分——模型与推理是能力底座，编排与框架是控制流组织方式，工具与协议是系统对外连接方式，评测与可观测是质量保障，安全与治理是风险约束，采用与生态是产业落地。六个域相互独立（任一域的知识/工程问题不与其他域重叠），完全穷尽（一个 Agentic 系统的能力问题必落入其中至少一个域）。

### 第2层：时间轴（拆解维度：现状 vs 趋势）

每个第1层能力域下按「现状 / 趋势」互斥穷尽地拆解：现状回答「今天业界普遍是什么」，趋势回答「业界正在向哪里演进」。两者互斥（同一论断不会同时是现状和趋势）且穷尽（任一论断要么描述当前，要么描述演进方向）。

### 第3层：假设（附着于叶子分支的可证伪假设）

| 编号 | 挂载叶子分支（能力域 × 时间轴） | 假设 |
| --- | --- | --- |
| H1 | 模型与推理 × 现状 | 业界已形成「工作流 vs 智能体」的架构区分共识 |
| H2 | 编排与框架 × 现状 | 厂商以「开源 SDK + 托管平台」双轨交付编排能力 |
| H3 | 编排与框架 × 趋势 | 编排交付形态从「开发者自建」向「厂商托管智能体」演进 |
| H4 | 工具与协议 × 趋势 | MCP 正成为连接 Agent 与外部工具/上下文的事实标准 |
| H5 | 工具与协议 × 趋势 | A2A 协议正推动 Agent 间互操作标准化 |
| H6 | 评测与可观测 × 现状 | 评测与可观测已成为生产级 Agent 平台的内置一等能力 |
| H7 | 安全与治理 × 现状 | 计算机使用类 Agent 的可靠性仍不足，需人工监督与护栏 |
| H8 | 采用与生态 × 现状 | 企业采用集中在「对话+行动、成功标准清晰、有反馈闭环」场景 |
| H9 | 编排与框架 × 现状（反例检验） | 构建 Agent 系统总是应优先采用复杂框架/专用库 |
| H10 | 采用与生态 × 趋势 | Agent 将成为劳动力的一部分并催生 Agent 间服务交易 |

---

## 3. 假设与验证结论

### 假设 H1：业界已形成「工作流 vs 智能体」的架构区分共识

- 假设陈述：业界主流厂商在架构层把 Agentic 系统区分为「工作流（workflow）」与「智能体（agent）」两类，前者由预定义代码路径编排，后者由 LLM 动态决策自身流程。
- 可证伪条件：若主流厂商将 Agentic 系统视为无区别的单一范式、不区分预定义编排与动态决策，则本假设被证伪。
- 验证结论：supported
- 来源：
  - URL: https://www.anthropic.com/research/building-effective-agents
  - 原文段落："Workflows are systems where LLMs and tools are orchestrated through predefined code paths. Agents, on the other hand, are systems where LLMs dynamically direct their own processes and tool usage, maintaining control over how they accomplish tasks."

### 假设 H2：厂商以「开源 SDK + 托管平台」双轨交付编排能力

- 假设陈述：头部厂商同时以开源 Agent SDK 和平台化 API/托管能力交付 Agent 编排，降低开发者构建成本。
- 可证伪条件：若头部厂商只提供 SDK 或只提供托管平台中的一种、无并行双轨交付，则本假设被证伪。
- 验证结论：supported
- 来源：
  - URL: https://openai.com/index/new-tools-for-building-agents/
  - 原文段落："The new open-source Agents SDK simplifies orchestrating multi-agent workflows"；同页说明其配套 Responses API 与内置工具（web search / file search / computer use）构成平台化交付。
  - URL: https://www.anthropic.com/research/building-effective-agents
  - 原文段落：列出的框架包含 "The Claude Agent SDK"、"Strands Agents SDK by AWS"、"Rivet"、"Vellum"，并注明当前做法见 "how we built Claude Managed Agents"。

### 假设 H3：编排交付形态从「开发者自建」向「厂商托管智能体」演进

- 假设陈述：Agentic 编排的交付重心正在从「开发者自行组合框架」向「厂商托管的智能体（Managed Agents）」演进。
- 可证伪条件：若厂商没有推出托管智能体形态、仍以框架/SDK 为唯一交付方式，则本假设被证伪。
- 验证结论：supported
- 来源：
  - URL: https://www.anthropic.com/research/building-effective-agents
  - 原文段落："Much of the tooling landscape described in this post has changed since December 2024. For our current approach, see how we built Claude Managed Agents and the Managed Agents documentation."

### 假设 H4：MCP 正成为连接 Agent 与外部工具/上下文的事实标准

- 假设陈述：Model Context Protocol（MCP）正成为连接 AI 应用/Agent 与外部系统（数据、工具、工作流）的开放标准。
- 可证伪条件：若 MCP 未被跨厂商客户端（如 Claude、ChatGPT、VS Code、Cursor）广泛支持，或存在另一协议在工具/上下文连接层取得同等或更高采纳，则本假设被削弱或证伪。
- 验证结论：supported
- 来源：
  - URL: https://modelcontextprotocol.io/introduction
  - 原文段落："MCP (Model Context Protocol) is an open-source standard for connecting AI applications to external systems."；"Think of MCP like a USB-C port for AI applications."；"AI assistants like Claude and ChatGPT, development tools like Visual Studio Code, Cursor ... all support MCP"

### 假设 H5：A2A 协议正推动 Agent 间互操作标准化

- 假设陈述：Agent2Agent（A2A）协议正在以开放标准方式推动不同厂商/框架 Agent 之间的互操作与协作，并与 MCP 形成互补。
- 可证伪条件：若 A2A 仅由单一厂商推进、未获得跨厂商生态背书，则本假设被证伪。
- 验证结论：supported
- 来源：
  - URL: https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/
  - 原文段落："we're launching a new, open protocol called Agent2Agent (A2A), with support and contributions from more than 50 technology partners"；"A2A is an open protocol that complements Anthropic's Model Context Protocol (MCP), which provides helpful tools and context to agents."

### 假设 H6：评测与可观测已成为生产级 Agent 平台的内置一等能力

- 假设陈述：评测（evaluation）与可观测（tracing/observability）已成为生产级 Agent 平台/SDK 的内置一等能力，而非事后附加。
- 可证伪条件：若主流 Agent SDK 未把 tracing 与 evaluation 作为内置能力、需完全自行构建，则本假设被证伪。
- 验证结论：supported
- 来源：
  - URL: https://openai.com/index/new-tools-for-building-agents/
  - 原文段落：Agents SDK 改进包含 "Tracing & Observability: Visualize agent execution traces to debug and optimize performance."；该页并提及 "tracing and evaluations" 用于评估 Agent 性能。

### 假设 H7：计算机使用类 Agent 的可靠性仍不足，需人工监督与护栏

- 假设陈述：以计算机使用（computer use）为代表的自动化操作类 Agent 在真实任务上的可靠性仍不充分，厂商建议人工监督并内置护栏。
- 可证伪条件：若计算机使用类 Agent 在真实任务基准上已高度可靠、无需人工监督，则本假设被证伪。
- 验证结论：supported
- 来源：
  - URL: https://openai.com/index/new-tools-for-building-agents/
  - 原文段落："CUA's performance on OSWorld, a benchmark designed to measure the performance of AI agents on real-world tasks, is currently at 38.1%, indicating that the model is not yet highly reliable for automating tasks on operating systems. Human oversight is recommended in these scenarios."

### 假设 H8：企业采用集中在「对话+行动、成功标准清晰、有反馈闭环」场景

- 假设陈述：企业 Agent 采用集中在客服与编码等「既需对话又需行动、成功标准清晰、具备反馈闭环」的场景。
- 可证伪条件：若企业 Agent 采用主要分布在成功标准模糊、无反馈闭环的场景，则本假设被证伪。
- 验证结论：supported
- 来源：
  - URL: https://www.anthropic.com/research/building-effective-agents
  - 原文段落："Both applications illustrate how agents add the most value for tasks that require both conversation and action, have clear success criteria, enable feedback loops, and integrate meaningful human oversight."（附录 1 以 Customer support 与 Coding agents 两个领域为证）。

### 假设 H9：构建 Agent 系统总是应优先采用复杂框架/专用库

- 假设陈述：构建 Agent 系统时，采用复杂框架或专用库总是比直接使用 LLM API 更优。
- 可证伪条件：若存在权威证据表明「先用最简单的方案、仅在收益明确时增加复杂度」更优，则本假设被证伪。
- 验证结论：refuted
- 来源：
  - URL: https://www.anthropic.com/research/building-effective-agents
  - 原文段落："Consistently, the most successful implementations weren't using complex frameworks or specialized libraries. Instead, they were building with simple, composable patterns."；"When building applications with LLMs, we recommend finding the simplest solution possible, and only increasing complexity when needed."；"We suggest that developers start by using LLM APIs directly: many patterns can be implemented in a few lines of code."

### 假设 H10：Agent 将成为劳动力的一部分并催生 Agent 间服务交易

- 假设陈述：Agent 将在近期成为劳动力不可分割的一部分，并催生 Agent 之间的服务交易/Agent 经济。
- 可证伪条件：若主流厂商未表态该方向，或该方向仅停留在愿景而缺乏任何落地证据，则本假设被削弱或证伪。
- 验证结论：undetermined
- 来源：
  - URL: https://openai.com/index/new-tools-for-building-agents/
  - 原文段落："We believe agents will soon become integral to the workforce, significantly enhancing productivity across industries."（此为方向性表态，非已证事实）
  - URL: https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/
  - 原文段落：伙伴引述如 Supertab "agents will be able to pay for, charge for, and exchange services — just like human businesses do."（仅为伙伴愿景，且 A2A "production-ready version" 尚未证实发布）
  - 判定依据：方向被多方背书但缺少可验证的落地证据（agent 间交易规模、生产就绪协议发布时间等均未证实），证据不足，故为 undetermined。

---

## 4. 洞察结论与趋势

1. **架构共识已确立**：业界已把 Agentic 系统区分为「工作流（预定义编排）」与「智能体（动态决策）」，并以此为基础推荐由简入繁的构建路径。
   - 来源：https://www.anthropic.com/research/building-effective-agents（"Workflows are systems where LLMs and tools are orchestrated through predefined code paths. Agents... dynamically direct their own processes and tool usage"）

2. **交付形态平台化**：编排能力从「开发者自建框架」向「开源 SDK + 厂商托管平台」双轨并进，且托管智能体（如 Claude Managed Agents）成为厂商当前主推方向。
   - 来源：https://openai.com/index/new-tools-for-building-agents/（"The new open-source Agents SDK..."）；https://www.anthropic.com/research/building-effective-agents（"For our current approach, see how we built Claude Managed Agents"）

3. **互操作标准化是明确趋势**：工具/上下文连接层由 MCP 主导（"USB-C port for AI applications"），Agent 间协作层由 A2A 推进（50+ 伙伴），两层协议互补。
   - 来源：https://modelcontextprotocol.io/introduction；https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/

4. **评测、可观测、护栏成为一等公民**：生产级 Agent 平台内置 tracing/evaluation/guardrails；同时计算机使用类 Agent 可靠性仍低（OSWorld 38.1%），人工监督仍是行业默认要求。
   - 来源：https://openai.com/index/new-tools-for-building-agents/

5. **采用聚焦可验证场景**：企业采用集中在客服、编码等「成功标准清晰、有反馈闭环、可人工监督」的场景，并以成功结果计费。
   - 来源：https://www.anthropic.com/research/building-effective-agents（"clear success criteria, enable feedback loops, and integrate meaningful human oversight"）

6. **反例/边界结论**：即便框架繁荣，「复杂框架优先」被业界明确证伪——最成功的实现用的是简单可组合模式，框架的抽象层反而会遮蔽底层 prompt/response、增加调试难度。
   - 来源：https://www.anthropic.com/research/building-effective-agents（"they often create extra layers of abstraction that can obscure the underlying prompts and responses, making them harder to debug"）

7. **待观察方向**：「Agent 成为劳动力一部分 / Agent 间服务交易」是被多方背书的方向，但当前证据不足，应保持 undetermined 并持续跟踪 A2A 生产就绪版本与真实采用数据。
   - 来源：https://openai.com/index/new-tools-for-building-agents/；https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/

---

## 5. 验收测试标准（控制点 / 观测点）

以下为业务语义层的验收标准（物理化由 ImplementationDesign 负责）：

- 控制点：验收方打开洞察交付物文档 `docs/insights/agentic-engineering-现状和趋势.md`。
- 观测点 1：文档包含 SMART 五要素（Specific / Measurable / Achievable / Relevant / Time-bound）。
- 观测点 2：文档包含 ≥3 层 MECE 决策树，并给出拆解维度的 MECE 论证。
- 观测点 3：每个假设具备「假设陈述 + 可证伪条件」，并携带唯一三态结论（supported / refuted / undetermined）。
- 观测点 4：每个假设结论均给出 URL 链接与原文段落来源。
