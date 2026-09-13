export default function getError(err) {
    return new String(err).split(':')[1]
}