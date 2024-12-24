import React from 'react';
import styles from './Players.module.css';

function EntriesTable({ players, onDelete }) {
    return (
        <table className={styles.table}>
            <thead>
                <tr className={styles.tableHeader}>
                    <th className={styles.tableCell}>Goals</th>
                    <th className={styles.tableCell}>Assists</th>
                    <th className={styles.tableCell}>Created At</th>
                </tr>
            </thead>
            <tbody>
                {players.map((player, index) => {
                    const date = new Date(player.created_at);
                    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                    return (
                        <tr key={player._id} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#fff' }}>
                            <td className={styles.tableCell}>{player.goals}</td>
                            <td className={styles.tableCell}>{player.assists}</td>
                            <td className={styles.tableCell}>{formattedDate}</td>
                            <td className={styles.tableCell}>
                                <button
                                    onClick={() => onDelete(player._id)}
                                    className="text-red-600 font-bold py-2 px-4 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default EntriesTable;