# RADIUSdesk Dictionary for FreeRADIUS 3.0 - Full Set
# Matches Cake4 / 2025 schema
# RADIUSdesk Dictionary - Comprehensive Set 2026
VENDOR          Rd                              16459
BEGIN-VENDOR    Rd

ATTRIBUTE       Rd-Realm                        1       string
ATTRIBUTE       Rd-User-Type                    2       string
ATTRIBUTE       Rd-Device-Owner                 3       string
ATTRIBUTE       Rd-Account-Disabled             4       integer
ATTRIBUTE       Rd-Total-Time                   5       integer
ATTRIBUTE       Rd-Total-Data                   6       integer
ATTRIBUTE       Rd-Reset-Type-Time              7       string
ATTRIBUTE       Rd-Reset-Type-Data              8       string
ATTRIBUTE       Rd-Voucher                      9       string
ATTRIBUTE       Rd-Mac-Owner                    10      string
ATTRIBUTE       Rd-Used-Data                    11      integer
ATTRIBUTE       Rd-Used-Time                    12      integer
ATTRIBUTE       Rd-Cap-Type-Data                13      string
ATTRIBUTE       Rd-Cap-Type-Time                14      string
ATTRIBUTE       Rd-Mc-Id-Check                  15      string
ATTRIBUTE       Rd-Mac-Id-Check                 16      string
ATTRIBUTE       Rd-Auth-Type                    17      string
ATTRIBUTE       Rd-Mac-Counter-Time             20      string
ATTRIBUTE       Rd-Mac-Counter-Data             21      string
ATTRIBUTE       Rd-Mac-Counter-Board            22      string

END-VENDOR      Rd

# INTERNAL attributes MUST be outside the VENDOR block
ATTRIBUTE       Rd-Mac-Check                    3000    string
ATTRIBUTE       Rd-Mac-Check-First              3001    string