package snowflake

import (
	"strconv"
	"sync"
	"time"
	"bastion-brotherhood/config"

	"github.com/bwmarrin/snowflake"
)

var (
	node          *snowflake.Node
	snowflakeOnce sync.Once
)

func initSnowflake(startTime string, machineID int) {
	var st time.Time
	// 时间为UTC时间，比中国慢8个小时
	st, err := time.Parse("2006-01-02 00:00:00", startTime)
	if err != nil {
		panic(err)
	}
	snowflake.Epoch = st.UnixNano() / 1000000
	node, err = snowflake.NewNode(int64(machineID))
	if err != nil {
		panic(err)
	}
	
}

func GenID() string {
	// 保证只执行一次
	snowflakeOnce.Do(func() {
		initSnowflake(time.Now().Format("2006-01-02 00:00:00"), config.GetGlobalConfig().MechineConfig.MachineID)
	})
	return strconv.FormatInt(node.Generate().Int64(), 10)
}
