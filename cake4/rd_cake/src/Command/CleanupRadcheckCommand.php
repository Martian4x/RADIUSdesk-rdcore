<?php
namespace App\Command;

use Cake\Command\Command;
use Cake\Console\Arguments;
use Cake\Console\ConsoleIo;
use Cake\Datasource\ConnectionManager;

class CleanupRadcheckCommand extends Command
{
    public function execute(Arguments $args, ConsoleIo $io): int
    {
        $db = ConnectionManager::get('default');
        
        $io->out("<info>Starting radcheck duplicate cleanup...</info>");

        // This query keeps the row with the HIGHEST ID (the most recent one)
        // and deletes all older duplicates based on username and attribute.
        $sql = "
            DELETE r1 FROM radcheck r1
            INNER JOIN radcheck r2 
            WHERE r1.id < r2.id 
              AND r1.username = r2.username 
              AND r1.attribute = r2.attribute
        ";

        try {
            $result = $db->execute($sql);
            $count = $result->rowCount();
            
            if ($count > 0) {
                $io->success("Successfully removed $count duplicate entries from radcheck.");
            } else {
                $io->out("No duplicates found. Table is already optimized.");
            }
        } catch (\Exception $e) {
            $io->error("Cleanup failed: " . $e->getMessage());
            return static::CODE_ERROR;
        }

        // Optimization Step: Re-index/Defragment the table
        $io->out("Optimizing table structure...");
        $db->execute("OPTIMIZE TABLE radcheck");
        
        $io->success("Cleanup and Optimization complete.");
        return static::CODE_SUCCESS;
    }
}