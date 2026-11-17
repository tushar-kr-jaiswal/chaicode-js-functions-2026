/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
    let candidatesArr = structuredClone(candidates);
    let registeredVoterArr = [];
    let votedArr = [];

    function registerVoter(voter) {
        if (voter === null || typeof voter !== "object" || Array.isArray(voter)) return false;

        if (typeof voter.age !== "number" || !Number.isFinite(voter.age) || voter.age < 18)
            return false;

        if (typeof voter.id !== "string") return false;

        if (typeof voter.name !== "string" || voter.name.trim() === "") return false;

        const isExistingVoter = registeredVoterArr.some((obj) => obj.id === voter.id);

        if (isExistingVoter) return false;

        registeredVoterArr.push(voter);
        return true;
    }

    function castVote(voterId, candidateId, onSuccess, onError) {
        if (typeof voterId !== "string" || voterId.trim() === "") return false;
        if (typeof candidateId !== "string" || candidateId.trim() === "") return false;

        const voterFound = registeredVoterArr.some((voter) => voter.id === voterId);
        if (!voterFound) {
            return onError("Voter not registered");
        }

        const hasVoted = votedArr.some((id) => id === voterId);
        if (hasVoted) return onError("Voter has voted already!");

        let isValidCandidateId = candidatesArr.find((candidate) => candidate.id === candidateId);

        if (!isValidCandidateId) {
            const result = onError("Candidate ID is invalid");
            return result;
        } else {
            votedArr.push(voterId);

            isValidCandidateId.votes = (isValidCandidateId.votes ?? 0) + 1;

            const result = onSuccess({ voterId, candidateId });
            return result;
        }
    }

    function getResults(sortFn = (a, b) => (b.votes ?? 0) - (a.votes ?? 0)) {
        const replicaCandidatesArr = structuredClone(candidatesArr).sort(sortFn);
        return replicaCandidatesArr;
    }

    function getWinner() {
        const winner = getResults()[0];
        return !winner.votes ? null : winner;
    }

    return {
        registerVoter,
        castVote,
        getResults,
        getWinner,
    };
}

export function createVoteValidator(rules) {
    return (voter) => {
        const result = rules.requiredFields.every(
            (field) => voter[field] !== undefined && voter[field] !== null,
        );
        if (voter === null || typeof voter !== "object" || Array.isArray(voter)) {
            return { valid: false, reason: "Not an Object" };
        } else if (voter.age < rules.minAge) {
            return { valid: false, reason: "Below age" };
        } else if (!result) {
            return { valid: false, reason: "Required fields absent" };
        } else {
            return { valid: true, reason: "all fields present" };
        }
    };
}

export function countVotesInRegions(regionTree) {
    if (regionTree === null || typeof regionTree !== "object" || Array.isArray(regionTree))
        return 0;

    const current =
        typeof regionTree.votes === "number" &&
        Number.isFinite(regionTree.votes) &&
        Number.isInteger(regionTree.votes) &&
        regionTree.votes > 0
            ? regionTree.votes
            : 0;

    if (!Array.isArray(regionTree.subRegions)) return current;

    const reducedSum = regionTree.subRegions.reduce(
        (sum, region) => sum + countVotesInRegions(region),
        0,
    );

    return current + reducedSum;
}

export function tallyPure(currentTally, candidateId) {
    if (typeof currentTally !== "object" || Array.isArray(currentTally) || currentTally === null)
        return;
    const copiedTally = structuredClone(currentTally);

    return {
        ...copiedTally,
        [candidateId]: (copiedTally[candidateId] ?? 0) + 1,
    };
}
