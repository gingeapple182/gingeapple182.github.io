pico-8 cartridge // http://www.pico-8.com
version 42
__lua__
-- main --

function _init()
 iplr()
 stimer=0
 state="menu"
 init_maps()
 init_enemies()
 init_encounter()
 current_map = "map1"
end


function _update()
 -- menu --
	if state == "menu" then
	 if btnp(5) then
	  state = "explore"
	 end
	-- encounter --
	elseif state == "encounter" then
	 update_encounter()
	-- explore -- 
	elseif state ==  "explore" then
  uplr()
  update_enemies()
	 check_enemy_encounter()
	 check_item_pickup()
	 if not moving then
	  animate_idle()
	 else
	  stimer=0
	 end
	
	 local m = maps[current_map]
  local mapx = m[1]
  local mapy = m[2]
  local tx = flr((player.x+8)/8) + mapx
  local ty = flr((player.y+8)/8) + mapy
  if mget(tx, ty) == 83 then
   player.speed = 0.5
  else
   player.speed = 1
  end
 end
end


function _draw()
	if state == "menu" then
	 menu()
	elseif state == "explore" then
  explore()
 elseif state == "encounter" then
  draw_encounter()
 elseif state == "dead" then
  dead()
 end
end
-->8
-- player --

function iplr()
 player={
  sp=40,
  x=63,
  y=63,
  w=1,
  h=1, 
  fx=false,
  fy=false,
  speed=1,
  dir="side",
  hp=10,
  max_hp=10,
  stamina=5,
  max_stamina=5,
  inventory = {
   {type = "health_potion", qty = 1},
   {type = "stamina_potion", qty = 1}
  }
 }
  ani_speed = 12 -- 30/ani_speed = fps
end


function uplr()
 moving = move(player)
end


function dplr()
	spr(player.sp, player.x, player.y, player.w, player.h, player.fx, player.fy)	
end


function animate_idle()
 local base=40
 if player.dir=="side" then 
 	base=40
 elseif player.dir=="up" then 
 	base=42
 elseif player.dir=="down" then 
  base=41 
 end

 if stimer<ani_speed then
  stimer+=1
 else
  if player.sp < base or player.sp > base + 6 then
   player.sp = base
  elseif player.sp < base+16 then
   player.sp+=16
  else
   player.sp=base
  end
  stimer=0
 end
end
-->8
-- enemy --

enemy_defs = {
 rat = {
  name = "rat",
  sp = 32,
  encounter_sp = 8,
  max_hp = 5,
  attack = function(self, player)
   local dmg = 1
   player.hp -= dmg
   return "the rat bites you for "..dmg.." damage!"
  end
 },
 bat = {
  name = "bat",
  sp = 34,
  encounter_sp = 10,
  max_hp = 4,
  attack = function(self, player)
   if rnd() < 0.1 then
    player.dazed = true
    return "the bat flaps and dazes you!"
   else
    local dmg = 1
    player.hp -= dmg
    return "the bat bites you for "..dmg.." damage!"
   end
  end
 }
}

function spawn_enemy(type, map, x, y)
 local def = enemy_defs[type]
 return {
  type = type,
  map = map,
  x = x,
  y = y,
  alive = true,
  hp = def.max_hp,
  anim_frame = 0,
  anim_timer = 0,
  def = def
 }
end

function init_enemies()
 enemies = {
  spawn_enemy("rat", "map1", 80, 95),
  spawn_enemy("rat", "map1", 90, 20),
  spawn_enemy("bat", "map4", 80, 60)
 }
end

function update_enemies()
 for e in all(enemies) do
  if e.alive then
   e.anim_timer += 1
   if e.anim_timer > 15 then
    e.anim_timer = 0
    e.anim_frame = 1 - e.anim_frame
   end
  end
 end
end

function draw_enemies()
 for e in all(enemies) do
  if e.map == current_map and e.alive then
   spr(e.def.sp + e.anim_frame, e.x, e.y)
  end
 end
end

function check_enemy_encounter()
 for e in all(enemies) do
  if e.map == current_map and e.alive then
   if abs(player.x - e.x) < 8 and abs(player.y - e.y) < 8 then
    state = "encounter"
    current_enemy = e
    init_encounter()
    break
   end
  end
 end
end

function safe_move_player_away()
 local dirs = {
  {dx=-16, dy=0},  -- left
  {dx=16, dy=0},   -- right
  {dx=0, dy=-16},  -- up
  {dx=0, dy=16},   -- down
 }
 for d in all(dirs) do
  local nx = player.x + d.dx
  local ny = player.y + d.dy
  -- create a temp object to check collision
  local temp = {}
  for k,v in pairs(player) do temp[k]=v end
  temp.x = nx
  temp.y = ny
  if not collide(temp) then
   player.x = nx
   player.y = ny
   return
  end
 end
 -- fallback: don't move if all directions blocked
end
-->8
-- screens --

function menu()
 cls(3)
	print("gronk", 64 - (#"title"*4)/2, 42, 7)
	print("press any btn to start", 64 - (#"press any btn to start"*4)/2, 85, 6)
end


function explore()
 cls(3)
	draw_map(current_map)
	draw_enemies()
	draw_items()
 dplr()
 maplyr(current_map)
	draw_health()
	--print("cell x:"..flr((player.x+4)/8).." y:"..flr((player.y+4)/8), 2, 18, 7)
 --print("current map: ".. current_map)
 if pickup_timer > 0 then
  print(pickup_msg, 20, 110, 7)
  pickup_timer -= 1
 end
 update_health()
end


function dead()
 cls(0)
	print("you died", 64 - (#"you died"*4)/2, 42, 7)
end
-->8
-- encounter --

function init_encounter()
 player.stamina=player.max_stamina
 if current_enemy then
  current_enemy.hp = current_enemy.def.max_hp
 end
 categories = {"attack", "defend", "items", "run"}
 sub_options = {
  attack = {"punch", "kick"},
  defend = {"brace"},
  items = {},
  run = {}
 }
 selected_cat = 1
 selected_sub = 1
 in_submenu = false
 in_item_menu = false
 selected_item = 1

 last_player_msg = ""
 last_enemy_msg = ""
 player_defend_turns = 0
 brace_this_turn = false
 turn = "player"
 encounter_phase = "action" -- can be "action", "run_confirm", "run_result", "victory", "defeat"
 run_result = nil -- stores if player took damage on run

 run_confirm_selected = 1 -- 1 = continue, 2 = cancel
end

function update_encounter()
 if state == "encounter" then

  -- phase: player died
  if player.hp < 1 and encounter_phase ~= "defeat" then
   last_player_msg = "you got defeated by the "..current_enemy.def.name.."!"
   encounter_phase = "defeat"
  end

  -- phase: enemy defeated
  if current_enemy.hp < 1 and encounter_phase ~= "victory" then
   last_player_msg = "you successfully defeated the "..current_enemy.def.name.."!"
   current_enemy.alive = false
   encounter_phase = "victory"
  end

  -- phase: run result (after player chose to run)
  if encounter_phase == "run_result" then
   if btnp(4) or btnp(5) then
    safe_move_player_away()
    state = "explore"
   end
   return
  end

  -- phase: victory or defeat (show continue only)
  if encounter_phase == "victory" or encounter_phase == "defeat" then
   if btnp(4) or btnp(5) then
    if encounter_phase == "victory" then
     safe_move_player_away()
     state = "explore"
    else
     state = "dead"
    end
   end
   return
  end

  -- phase: run confirmation
  if encounter_phase == "run_confirm" then
   -- up/down to select
   if btnp(2) then run_confirm_selected = max(1, run_confirm_selected - 1) end
   if btnp(3) then run_confirm_selected = min(2, run_confirm_selected + 1) end

   if btnp(4) then -- x/confirm
    if run_confirm_selected == 1 then
     -- continue
     if rnd() < 0.5 then
      local dmg = 1
      player.hp -= dmg
      last_player_msg = "you escaped, but took "..dmg.." damage!"
      run_result = true
     else
      last_player_msg = "you escaped safely!"
      run_result = false
     end
     encounter_phase = "run_result"
    else
     -- cancel
     encounter_phase = "action"
    end
   elseif btnp(5) then -- o/cancel
    encounter_phase = "action"
   end
   return
  end

  -- phase: main action selection
  if encounter_phase == "action" then
   if not in_submenu then
    if btnp(2) then selected_cat = max(1, selected_cat-1) selected_sub=1 end
    if btnp(3) then selected_cat = min(#categories, selected_cat+1) selected_sub=1 end
    local cat = categories[selected_cat]
    if cat == "run" and (btnp(1) or btnp(4)) then
     last_player_msg = "are you sure you want to run?"
     encounter_phase = "run_confirm"
     run_confirm_selected = 1
     return
    end
    if #sub_options[cat] > 0 or cat == "items" then
     if btnp(1) or btnp(4) then
      in_submenu = true
      selected_sub = 1
     end
     local max_sub
     if cat == "items" then
      local inv = player.inventory
      if #inv == 0 then
       max_sub = 1 -- only "*no items*"
      else
       max_sub = #inv
      end
     else
      max_sub = #sub_options[cat]
     end
     if btnp(2) then selected_sub = max(1, selected_sub-1) end
     if btnp(3) then selected_sub = min(max_sub, selected_sub+1) end
    end
   else
    local cat = categories[selected_cat]
    local subs = sub_options[cat]
    if cat == "items" then
     local inv = player.inventory
     if #inv == 0 then
      -- only "*no items*" is selectable, do nothing on confirm
      if btnp(0) then
       in_submenu = false
      end
     else
      if btnp(2) then selected_sub = max(1, selected_sub-1) end
      if btnp(3) then selected_sub = min(#inv, selected_sub+1) end
      if btnp(4) or btnp(1) then
       local itm = inv[selected_sub]
       local msg = item_defs[itm.type].use()
       last_player_msg = msg
       itm.qty -= 1
       if itm.qty <= 0 then
        deli(inv, selected_sub)
        selected_sub = max(1, selected_sub-1)
       end
       in_submenu = false
       turn = "enemy"
      elseif btnp(0) then
       in_submenu = false
      end
     end
    else
     if btnp(2) then selected_sub = max(1, selected_sub-1) end
     if btnp(3) then selected_sub = min(#subs, selected_sub+1) end
     if btnp(4) or btnp(1) then
      if subs[selected_sub] == "punch" then
       current_enemy.hp -= 1
       last_player_msg = str_replace(player_msgs.attack[1], "%e", current_enemy.def.name)
       in_submenu = false
       turn = "enemy"
      elseif subs[selected_sub] == "kick" then
       if player.stamina > 0 then
        player.stamina -= 1
        current_enemy.hp -= 2
        last_player_msg = str_replace(player_msgs.attack[2], "%e", current_enemy.def.name)
        in_submenu = false
        turn = "enemy"
       else
        last_player_msg = "not enough stamina!"
       end
      elseif subs[selected_sub] == "brace" then
       if player.stamina > 0 then
        player.stamina -= 1
        last_player_msg = player_msgs.defend[2]
        player_defend_turns = 2
        brace_this_turn = true
        in_submenu = false
        turn = "enemy"
       else
        last_player_msg = "not enough stamina!"
       end
      end
     end
     if btnp(0) then
      in_submenu = false
     end
    end
   end

   -- enemy turn (auto after player)
   if turn == "enemy" then
    if current_enemy.hp > 0 then
     local msg = current_enemy.def.attack(current_enemy, player)
     last_enemy_msg = msg
     brace_this_turn = false
     turn = "player"
    end
   end
  end
 end
 update_health()
end

function draw_encounter()
 cls(1)
 local panel_col = 1
 --message box--
 rectfill(2, 2, 76, 69, panel_col)
 rect(2, 2, 76, 69, 5)
 print_wrapped(last_player_msg, 6, 6, 69, 6)
 print_wrapped(last_enemy_msg, 6, 38, 69)
 --enemy box__
 rectfill(78, 2, 125, 69, panel_col)
 rect(78, 2, 125, 69, 5)
 circfill(92+8, 24+8, 12, 0)
 circ(92+8, 24+8, 12, 5)
 spr(current_enemy.def.encounter_sp, 92, 24, 2, 2)
 print(current_enemy.def.name, 88, 10, 7)
 draw_bar(87, 54, 30, 6, current_enemy.hp, current_enemy.def.max_hp, 8, 2)
 print(current_enemy.hp.."/"..current_enemy.def.max_hp, 87, 62, 7)
 --action box--
 rectfill(2, 71, 125, 125, panel_col)
 rect(2, 71, 125, 125, 5)
 draw_vbar(10, 80, 8, 36, player.hp, player.max_hp, 11, 8)
 print("♥", 10, 118, 8)
 draw_vbar(24, 80, 8, 36, player.stamina, player.max_stamina, 12, 13)
 print("◆", 24, 118, 12)

 -- draw options based on encounter_phase
 if encounter_phase == "run_confirm" then
  local y0 = 100
  print((run_confirm_selected == 1 and ">" or " ").."continue", 50, y0, run_confirm_selected == 1 and 7 or 6)
  print((run_confirm_selected == 2 and ">" or " ").."cancel", 50, y0+10, run_confirm_selected == 2 and 7 or 6)
 elseif encounter_phase == "run_result" or encounter_phase == "victory" or encounter_phase == "defeat" then
  print(">continue", 50, 110, 7)
 else
  -- regular options
  local cat_start_x = 40
  local cat_start_y = 80
  local cat_spacing = 10
  for i,cat in ipairs(categories) do
   local col = (i==selected_cat and not in_submenu) and 7 or 6
   print((i==selected_cat and not in_submenu and ">" or " ")..cat, cat_start_x, cat_start_y + (i-1)*cat_spacing, col)
  end
  local cat = categories[selected_cat]
  local subs = sub_options[cat]
  local sub_start_x = 73
  local sub_start_y = 80
  local sub_spacing = 10

  -- show submenu for the currently selected category
  if in_submenu then
   local overlay_x0 = 40
   local overlay_y0 = 71
   local overlay_x1 = 125
   local overlay_y1 = 125
   rectfill(overlay_x0, overlay_y0, overlay_x1, overlay_y1, panel_col)
   rect(overlay_x0, overlay_y0, overlay_x1, overlay_y1, 5)
   -- tab letters still visible, color as before
   local cat_start_x = 44
   local cat_start_y = 80
   local cat_spacing = 10
   for i,cat in ipairs(categories) do
    local col = (i == selected_cat) and 6 or 13
    print(sub(cat,1,1), cat_start_x, cat_start_y + (i-1)*cat_spacing, col)
   end
   sub_start_x = 50 -- move submenu options left
  end

  local maxlen = 12

  if cat == "items" then
   local inv = player.inventory
   if #inv == 0 then
    local col
    if in_submenu then
     col = (selected_sub == 1) and 7 or 6
    else
     col = 13
    end
    print(((selected_sub == 1 and in_submenu) and ">" or " ").."*no items*", sub_start_x, sub_start_y, col)
   else
    for i,itm in ipairs(inv) do
     local col
     if in_submenu then
      col = (i==selected_sub) and 7 or 6
     else
      col = 13
     end
     local name = item_defs[itm.type].name.." x"..itm.qty
     if not in_submenu then
      name = truncate_text(name, maxlen)
     end
     print(((i==selected_sub and in_submenu) and ">" or " ")..name, sub_start_x, sub_start_y + (i-1)*sub_spacing, col)
    end
   end
  elseif #subs > 0 then
   for i,sub in ipairs(subs) do
    local col
    if in_submenu then
     col = (i==selected_sub) and 7 or 6
    else
     col = 13
    end
    local name = sub
    if not in_submenu then
     name = truncate_text(name, maxlen)
    end
    print(((i==selected_sub and in_submenu) and ">" or " ")..name, sub_start_x, sub_start_y + (i-1)*sub_spacing, col)
   end
  end
 end
end
-->8
-- maps --
function init_maps()
 maps = {
  ["map1"] = {0, 0, 16, 16},
  ["map2"] = {16, 0, 16, 16},
  ["map3"] = {32, 0, 16, 16},
  ["map4"] = {48, 0, 16, 16},
  ["map5"] = {64, 0, 16, 16},
  ["map6"] = {80, 0, 16, 16},
  ["map7"] = {96, 0, 16, 16},
  ["map8"] = {112, 0, 16, 16},
  --second row--
  ["map9"] = {0, 16, 16, 16},
  ["map10"] = {16, 16, 16, 16},
  ["map11"] = {32, 16, 16, 16},
  ["map12"] = {48, 16, 16, 16},
  ["map13"] = {64, 16, 16, 16},
  ["map14"] = {80, 16, 16, 16},
  ["map15"] = {96, 16, 16, 16},
  ["map16"] = {112, 16, 16, 16},
  -- third row
  ["map17"] = {0, 32, 16, 16},
  ["map18"] = {16, 32, 16, 16},
  ["map19"] = {32, 32, 16, 16},
  ["map20"] = {48, 32, 16, 16},
  ["map21"] = {64, 32, 16, 16},
  ["map22"] = {80, 32, 16, 16},
  ["map23"] = {96, 32, 16, 16},
  ["map24"] = {112, 32, 16, 16}
 }

 map_map = {
  -- mapname = {left, right, up, down}
	 map1  = {nil,   "map2",  nil,   "map9"},
 map2  = {"map1","map3",  nil,   "map10"},
 map3  = {"map2","map4",  nil,   "map11"},
 map4  = {"map3","map5",  nil,   "map12"},
 map5  = {"map4","map6",  nil,   "map13"},
 map6  = {"map5","map7",  nil,   "map14"},
 map7  = {"map6","map8",  nil,   "map15"},
 map8  = {"map7",  nil,   nil,   "map16"},

 map9  = {nil,   "map10", "map1", "map17"},
 map10 = {"map9","map11", "map2", "map18"},
 map11 = {"map10","map12","map3", "map19"},
 map12 = {"map11","map13","map4", "map20"},
 map13 = {"map12","map14","map5", "map21"},
 map14 = {"map13","map15","map6", "map22"},
 map15 = {"map14","map16","map7", "map23"},
 map16 = {"map15",  nil,  "map8", "map24"},

 map17 = {nil,   "map18", "map9",  "nil"},
 map18 = {"map17","map19","map10", "nil"},
 map19 = {"map18","map20","map11", "nil"},
 map20 = {"map19","map21","map12", "nil"},
 map21 = {"map20","map22","map13", "nil"},
 map22 = {"map21","map23","map14", "nil"},
 map23 = {"map22","map24","map15", "nil"},
 map24 = {"map23",  nil,  "map16", "nil"} 
	}
end

function draw_map(mapname)
 local m = maps[mapname]
 if m then
  map(m[1], m[2], 0, 0, m[3], m[4])
 end
end


function maplyr(mapname)
 local m = maps[mapname] or maps(current_map)
 local mapx = m[1]
 local mapy = m[2]
 local w = m[3]
 local h = m[4]
 for my = 0, h-1 do
  for mx = 0, w-1 do
   local tile = mget(mapx + mx, mapy + my)
   if fget(tile, 1) then
    spr(tile, mx * 8, my * 8)
   end
  end
 end
end


function edge_check(o)
 local m = maps[current_map]
 local max_x = (m[3]*8) - o.w*8
 local max_y = (m[4]*8) - o.h*8

 -- right edge
 if o.x > max_x then
  local next_map = map_map[current_map][2]
  if next_map then
   current_map = next_map
   o.x = 0
  end
 end

 -- left edge
 if o.x < 0 then
  local next_map = map_map[current_map][1]
  if next_map then
   current_map = next_map
   o.x = (maps[current_map][3]*8) - o.w*8
  end
 end

 -- bottom edge
 if o.y > max_y then
  local next_map = map_map[current_map][4]
  if next_map then
   current_map = next_map
   o.y = 0
  end
 end

 -- top edge
 if o.y < 0 then
  local next_map = map_map[current_map][3]
  if next_map then
   current_map = next_map
   o.y = (maps[current_map][4]*8) - o.h*8
  end
 end
end


function collide(o)
 local m = maps[current_map]
 local mapx = m[1]
 local mapy = m[2]

 -- player position in tiles, relative to current map section
 local x1 = flr(o.x/8) + mapx
 local y1 = flr(o.y/8) + mapy
 local x2 = flr((o.x + o.w*8 - 1)/8) + mapx
 local y2 = flr((o.y + o.h*8 - 1)/8) + mapy

 local a = fget(mget(x1, y1), 0)
 local b = fget(mget(x1, y2), 0)
 local c = fget(mget(x2, y2), 0)
 local d = fget(mget(x2, y1), 0)
 
 if a or b or c or d then
  return true
 else
  return false
 end
end


function move(o)
 local lx = o.x
 local ly = o.y
 local moving = false
 
 if btn(⬆️) then
  o.y -= o.speed
  o.sp = 42
  o.fy = false
  o.dir = "up"
  moving = true
 end
 if btn(⬇️) then
  o.y += o.speed
  o.sp = 41
  o.fy = false
  o.dir = "down"
  moving = true
 end
 if btn(⬅️) then
  o.x -= o.speed
  o.sp = 40
  o.fx = true
  o.fy = false
  o.dir = "side"
  moving = true
 end
 if btn(➡️) then
	 o.x += o.speed
	 o.sp = 40
	 o.fx = false
	 o.fy = false
	 o.dir = "side"
	 moving = true
	end
	
	local m = maps[current_map]
 local min_x = 0
 local min_y = 0
 local max_x = (m[3]*8) - o.w*8
 local max_y = (m[4]*8) - o.h*8
 
 if collide(o) then
  o.x = lx
  o.y = ly
	end
	
	edge_check(o)
	
	return moving
end
-->8
-- player health --

function update_health()
 if player.hp < 0.1 then
  state = "dead"
 end
end


function draw_health()
 local health_color = 11
 local percent = player.hp / player.max_hp
 if percent < 0.25 then health_color = 8
 elseif percent < 0.5 then health_color = 9
 elseif percent < 0.75 then health_color = 10 end
 rect(4, 116, 44, 124, 6)
 rectfill(5, 117, 43, 123, 0)
 rectfill(6, 118, 6 + 36 * percent, 122, health_color)
 print(tostr(flr(player.hp)), 6, 118, 7)
end
-->8
-- utility/helper functions --

function str_replace(str, pat, rep)
 local out = ""
 local i = 1
 while i <= #str do
  if sub(str, i, i+#pat-1) == pat then
   out = out..rep
   i += #pat
  else
   out = out..sub(str, i, i)
   i += 1
  end
 end
 return out
end


function print_wrapped(str, x, y, w, c)
 local cx = x
 local cy = y
 local col = 7
 if c then
  col = c
 end
 for word in all(split(str, " ")) do
  local test = word.." "
  if (cx + #test*4 > x + w) or (sub(test,1,1)=="\n") then
   cx = x
   cy += 8
   if sub(test,1,1)=="\n" then test=sub(test,2) end
  end
  print(test, cx, cy, col)
  cx += #test*4
 end
end


function draw_bar(x, y, w, h, val, maxval, fill_col, back_col)
 rectfill(x, y, x+w-1, y+h-1, back_col)
 local fillw = flr((val/maxval)*w+0.5)
 if fillw > 0 then
  rectfill(x, y, x+fillw-1, y+h-1, fill_col)
 end
 rect(x, y, x+w-1, y+h-1, 5)
end


function draw_vbar(x, y, w, h, val, maxval, fill_col, back_col)
 rectfill(x, y, x+w-1, y+h-1, back_col)
 local fillh = flr((val/maxval)*h+0.5)
 if fillh > 0 then
  rectfill(x, y+h-fillh, x+w-1, y+h-1, fill_col)
 end
 rect(x, y, x+w-1, y+h-1, 5)
end

function truncate_text(txt, maxlen)
 if #txt > maxlen then
  return sub(txt, 1, maxlen - 3).."..."
 else
  return txt
 end
end
-->8
-- message tables --

player_msgs = {
 attack = {
  "you punched the %e and dealt 1 damage!",
  "you kicked the %e and dealt 2 damage!"
 },
 defend = {
  "you put your defences up!",
  "you brace yourself for incoming attacks!"
 }
}
enemy_msgs = {
 attack = {
  "the %e bit you for %d damage!",
  "the %e lunged at you for %d damage!"
 },
 defeated = {
  "the %e is defeated!"
 }
}
-->8
-- items --
item_defs = {
 -- health potion: restore 10♥
 health_potion = {
  name = "health potion",
  spr = 46,
  desc = "restores 10♥",
  use = function()
   local healed = min(10, player.max_hp - player.hp)
   player.hp += healed
   return "you used a health potion and restored "..healed.."♥"
  end
 },
 -- stamina potion: restore 5◆
 stamina_potion = {
  name = "stamina potion",
  spr = 47,
  desc = "restores 5◆",
  use = function()
   local gained = min(5, player.max_stamina - player.stamina)
   player.stamina += gained
   return "you used a stamina potion and restored "..gained.."◆"
  end
 },
 -- spinach: triples next attack damage
 spinach = {
  name = "can of spinach",
  spr = 62,
  desc = "triples damage of next attack",
  use = function()
   player.spinach_buff = true
   return "you feel super strong! your next attack is enhanced"
  end
 },
 -- apple: gains 3♥ and 2◆
 apple = {
  name = "apple",
  spr = 63,
  desc = "restores 3♥ & 2◆",
  use = function()
   local healed = min(3, player.max_hp - player.hp)
   local gained = min(2, player.max_stamina - player.stamina)
   player.hp += healed
   player.stamina += gained
   return "you ate an apple and restored "..healed.."♥ and "..gained.."◆"
  end
 }
}

-- items placed around the world
items_on_map = {
 -- map, x, y, type, picked
 {map="map1", x=32, y=40, type="health_potion", picked=false},
 {map="map2", x=80, y=60, type="stamina_potion", picked=false},
 {map="map3", x=24, y=80, type="spinach", picked=false},
 {map="map4", x=100, y=32, type="apple", picked=false},
 {map="map9", x=60, y=60, type="health_potion", picked=false},
 {map="map10", x=40, y=90, type="apple", picked=false},
 {map="map19", x=80, y=40, type="stamina_potion", picked=false},
 {map="map20", x=16, y=16, type="spinach", picked=false}
}

function draw_items()
 for i in all(items_on_map) do
  if not i.picked and i.map == current_map then
   spr(item_defs[i.type].spr, i.x, i.y)
  end
 end
end

pickup_msg = ""
	pickup_timer = 0
	
	function check_item_pickup()
	 for i in all(items_on_map) do
	  if not i.picked and i.map == current_map and abs(player.x - i.x) < 8 and abs(player.y - i.y) < 8 then
	   -- add to inventory
	   local found = false
	   for itm in all(player.inventory) do
	    if itm.type == i.type then
	     itm.qty += 1
	     found = true
	     break
	    end
	   end
	   if not found then
	    add(player.inventory, {type=i.type, qty=1})
	   end
	   i.picked = true
	   pickup_msg = "found "..item_defs[i.type].name.."!"
	   pickup_timer = 60 -- show for 1 second
	  end
	 end
	end
__gfx__
00000000000000000000000000000000000000000000000000000000000000000000000000000000001100000000110000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000005506600000000022100000000122000000000000000000000000000000000
0000000600000600000000000000000000000000000000000000000000000000005556ff60000000222110000100122200000000000000000000000000000000
0000006600006600000000060000060000000006000006000000000600000600005666ff60000000222111111100122200000000000000000000000000000000
00007777777777000000076677776600000000660000660000000766777766000066666600666600222111111100122200000000000000000000000000000000
00007777777777000000777777777700000077777777770000007777777777000666686d66666660222181181100122200000000000000000000000000000000
0000777798779800000077779877980000007777777777000000777798779800e666666666666666222211111101122200000000000000000000000000000000
0000777798779800000077779877980000007777987798000000777798779800e5d6d66666666666022201111111222000000000000000000000000000000000
00007777777777000000777777777700000077779877980000007777777777000555566666666666002201111111222000000000000000000000000000000000
000077777777770000007777777777000000777777777700000077777777770000005d66d666666d002001111110220000000000000000000000000000000000
0000007777770000000007777777700000007777777777000000077777777000000005dd5dd666d5002001111110020000000000000000000000000000000000
0000007777770000000000777777000000000077777700000000007777770000000000550555dd5f000001111110020000000000000000000000000000000000
0000067777770000000006777777000000000677777700000000067777770000000000ff00ff55ff000000111100000000000000000000000000000000000000
000066777777000000006677777700000000667777770000000066777777000000000000000000ff000000100100000000000000000000000000000000000000
000000770077000000000077007700000000007700770000000000770077000000000fff00000ff0000000100100000000000000000000000000000000000000
00000077007700000000007700770000000000770077000000000077007700000000f000ffffff00000000000000000000000000000000000000000000000000
0000000000000000000505000051515000000000000000000000000000000000000000000000000000000000000600600000000044444444000dd000000dd000
000600000006000000515150005818500000000000000000000000000000000000060060006000600060006000777770000000005555555500d44d0000d44d00
006600000066000002581852022111220000000000000000000000000000000000777770007777700077777000778780000000004554445400d55d0000d55d00
0686660006866600022111220221112200000000000000000000000000000000007787800078787000777770007777700000000045454454005dd500005dd500
666666f0666666f002211122025111520000000000000000000000000000000000777770007777700077777000077700000000004544545400588500005cc500
0060600f0060600f0051115000515150000000000000000000000000000000000007770000077700000777000007770000000000454445540588885005cccc50
000000f0000000f00051515000555550000000000000000000000000000000000067770000077700000767000067770000000000555555550588885005cccc50
00000000000000000005050000050500000000000000000000000000000000000007070000070700000707000070007000000000444444440055550000555500
00000000000000000000000000000000000000000000000000000000000000000006006000600060006000600000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000077777000777770007777700000000000000000000000000d555d00000bb000
0000000000000000000000000000000000000000000000000000000000000000007787800078787000777770000000000000000000000000d56665d0000b0000
0000000000000000000000000000000000000000000000000000000000000000007777700077777000777770000000000000000009000000d35553d000888000
0000000000000000000000000000000000000000000000000000000000000000000777000007770000077700000000000000000090999999d3bbb3d008887800
0000000000000000000000000000000000000000000000000000000000000000000777000007770000077700000000000000000009000909d3bbb3d008888800
0000000000000000000000000000000000000000000000000000000000000000006777000007770000076700000000000000000000000000d5bbb5d000888000
00000000000000000000000000000000000000000000000000000000000000000007070000070700000707000000000000000000000000000d555d0000000000
cccccccc3333333333333333333333334444444444444444cccc7ffbbfff7ccccccccccc00000000000000000000000000004444454400000000000000004444
cccccccc3333333333333333333333334555555445454545cccc7ffbbfff7ccccc77cccc00000000000000000000000000004444444400000000000000004544
cccccccc333333b333333333333333e34444444445454545ccc7fffbbfff7cccc7cc77cc00000000000000000000000000004444444400000000000000004444
cccccccc3b333b333a3333333e333b334555555445454545777ffffbbffff7cccccccccc00000000000000000000000000044444444440000000000000004444
cccccccc33b33b3333b333a333b33b334444444445454545fffffffbbfffff77cccccccc00000000000000000000000044444454444444444444444400004444
cccccccc33b3333333b33b3333b333334555555445454545fffffffbbfffffffccc77ccc00000000000000000000000044444444444444544444444400004444
cccccccc3333333333333b33333333334444444445454545fffffffbbfffffffcc7cc77c00000000000000000000000044554444444444444445445400004544
cccccccc33333333333333333333333345555554444444444545454545454545cccccccc00000000000000000000000044444444544444444444444400004444
cccccccccccccccccccccccc00000000000000000bbbbbb04545454545454545cccccccc00000066006600660066000044444444444544444544444444440000
cccccccccccccccccccccccc000bb0b000000000bbbbbbbbfffffffbbfffffffccbccccc00006666666666666666600044444444444444444544454454440000
cccccccccccccccccccccccc0b0bbbb000000000bbbbb33bfffffffbbfffffffcb3bcccc006666dd66dd66dd66dd660044445444444444444444444444440000
cccccccc77cc77cc77cccccc0bb0b0b000000000b33bbbbb77fffffbbfffffffccbccccc0666dddddddddddddddd660044444445444444444444444444440000
cccccc77ff77ff77ff7cccccbbbbb0b000000000bbbbbbbbcc7ffffbbffff777cccccccc66dddd55dd55dd55dd5dd66000044444444440000000000044540000
cccc77ffffffffffff7cccccbbbb4bbb00000000bbbb33bbccc7fffbbfff7ccccccccbcc66dd5555555555555555d66000004444444400000000000044440000
ccc7fffffffffffffff7ccccb4b45b4b00000000bbbbbbbbccc7fffbbff7ccccccccb3bc066dd551551155115555dd6600004445444400000000000044440000
ccc7ffffbbbbbbbbfff7ccccb5450b5b000000000b4444b0ccc7fffbbff7cccccccccbcc066dd551111111111155dd6600004444444400000000000044440000
cccc7ffb33333333bfff7ccccccc7ffbbfff7ccc00444400cccc7ff44fff7ccc4433333366dd551111111111155dd66033334411114433330000000000000000
cccc7ffb33333333bfff7ccccccc7ffbbfff7ccc00444400cccc7ff55fff7ccc5433333366dd55111111111d155dd66033334111111443330000000000000000
ccc7fffb33333333bff7ccccccc7fffbbfff7ccc00444440ccc7fff44fff7ccc44333333066dd55111d111111155dd6633341111111143330000000000000000
ccc7fffb33333333bff7cccc777ffffbbffff7cc00444400777ffff55ffff7cc54333333066dd5511111d1111155dd6634411111111114330000000000000000
cccc7ffb33333333bfff7cccfffffffbbfffff7700444400fffffff44fffff774433333366dd551111111111155dd66044111111d11111440000004444000000
cccc7ffb33333333bfff7cccfffffffbbfffffff00444400fffffff55fffffff5433333366dd551111d11111155dd66041111d11111d11140000044444400000
ccc7fffb33333333bff7ccccffffffbbbbffffff04444400fffffff44fffffff44333333066dd55111111d111155dd66111d1111111111110000444454440000
ccc7fffb33333333bff7ccccbbbbbbb00bbbbbbb00444400bbbbbbb55bbbbbbb54333333066dd551111111111155dd66111111111d1111110000445444440000
cccc7fffbbbbbbbbffff7cccbbbbbbb00bbbbbbb00444400bbbbbbb44bbbbbbb3333334566dd551111111111155dd66011111111111111110000444444440000
cccc7fffffffffffffff7cccffffffbbbbffffff00444400fffffff55fffffff3333334466dd555511551155155dd66011111111111111110000444545440000
ccccc7ffffffffffff77ccccfffffffbbfffffff00444400fffffff44fffffff33333345066dd555555555555555dd6641d111d1111d11140000044444400000
ccccc7ff77ff77ff77cccccc77fffffbbfffffff0044440077fffff55fffffff33333344066dd5dd55dd55dd55dddd6644111111111111440000004444000000
cccccc77cc77cc77cccccccccc7ffffbbffff77700444400cc7ffff44ffff777333333450066dddddddddddddddd666033411111111114430000000000000000
ccccccccccccccccccccccccccc7fffbbfff7ccc00444400ccc7fff55fff7ccc333333440066dd66dd66dd66dd66660033341111111143330000000000000000
ccccccccccccccccccccccccccc7fffbbff7cccc04444440ccc7fff44ff7cccc3333334500066666666666666666000033344111111433330000000000000000
ccccccccccccccccccccccccccc7fffbbff7cccc44444444ccc7fff55ff7cccc3333334400006600660066006600000033334411114433330000000000000000
0c1c2c3c0d1d2d3d0e1e2e3e0f1f2f3f000000000000000000000000000000000600340000000000000000000000268504060000000000000000000000000026
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
1ccdcdcdcdcdcdcdcdcdcdcdcdcdcdcd000000000000000000000000000000000600000000000000000000340000461515360000000034000000000000000026
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
2ccdcdcdcdcdcdcdcdcdcdcdcdcdcdcd000000000000000000000000000000000600000000240000000000000000000000000000000000000000003400000026
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
3ccdcdcdcdcdcdcdcdcdcdcdcdcdcdcd000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000026
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0dcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd000000000000000000000000000000000600000000000000000024003400000000000000000000002400000000240026
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
1dcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd000000000000000000000000000000000600000000340000000000000000000024003400000034000000000000000026
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
2dcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd000000000000000000000000000000000600000000000034000000000000000000000000000000000000000000000026
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
3dcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd000000000000000000000000000000000600000000000000000000000034000000000000000000000000000034000026
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0ecdcdcdcdcdcdcdcdcdcdcdcdcdcdcd000000000000000000000000000000000600000000002400000000000000000000000000000000000000240000000026
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
1ecdcdcdcdcdcdcdcdcdcdcdcdcdcdcd000000000000000000000000000000000600000000000000003434000000000000340000002400000000000000340026
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
2ecdcdcdcdcdcdcdcdcdcdcdcdcdcdcd000000000000000000000000000000000600000000000000000000000000000000000000000034000024000000000026
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
3ecdcdcdcdcdcdcdcdcdcdcdcdcdcdcd000000000000000000000000000000000600340000000024240000000000000000000000000000000000000000000026
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0fcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd000000000000000000000000000000000600000000003400000000003424000000000024000000000000003400000026
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
1fcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000026
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
2fcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000026
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
3fcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd000000000000000000000000000000000717171717171717171717171717171717171717171717171717171717171727
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
ffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000111111112222222233333333
fffff5ffffff55ffffff55fffff5ffff000000000000000000000000000000000000000000000000000000000000000000000000111111112222222233333333
fffff5fffff5ff5ffff5ff5ffff5ffff000000000000000000000000000000000000000000000000000000000000000000000000111111112222222233333333
fffff5fffffff5fffffff5fffff5f5ff000000000000000000000000000000000000000000000000000000000000000000000000111111112222222233333333
fffff5ffffff5fffffffff5ffff5f5ff000000000000000000000000000000000000000000000000000000000000000000000000111111112222222233333333
fffff5fffff5fffffff5ff5ffff5555f000000000000000000000000000000000000000000000000000000000000000000000000111111112222222233333333
fffff5fffff5555fffff55fffffff5ff000000000000000000000000000000000000000000000000000000000000000000000000111111112222222233333333
ffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000111111112222222233333333
ffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000044444444555555556666666677777777
fff5555fffff55fffff5555fffff55ff000000000000000000000000000000000000000000000000000000000000000044444444555555556666666677777777
fff5fffffff5ffffffffff5ffff5ff5f000000000000000000000000000000000000000000000000000000000000000044444444555555556666666677777777
ffff55fffff555fffffff5ffffff55ff000000000000000000000000000000000000000000000000000000000000000044444444555555556666666677777777
ffffff5ffff5ff5fffff5ffffff5ff5f000000000000000000000000000000000000000000000000000000000000000044444444555555556666666677777777
fff5ff5ffff5ff5ffff5fffffff5ff5f000000000000000000000000000000000000000000000000000000000000000044444444555555556666666677777777
ffff55ffffff55fffff5ffffffff55ff000000000000000000000000000000000000000000000000000000000000000044444444555555556666666677777777
ffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000044444444555555556666666677777777
ffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000008888888899999999aaaaaaaabbbbbbbb
ffff55fff5ff55fff5fff5fff5ff55ff00000000000000000000000000000000000000000000000000000000000000008888888899999999aaaaaaaabbbbbbbb
fff5ff5ff5f5ff5ff5fff5fff5f5ff5f00000000000000000000000000000000000000000000000000000000000000008888888899999999aaaaaaaabbbbbbbb
ffff555ff5f5ff5ff5fff5fff5fff5ff00000000000000000000000000000000000000000000000000000000000000008888888899999999aaaaaaaabbbbbbbb
ffffff5ff5f5ff5ff5fff5fff5ff5fff00000000000000000000000000000000000000000000000000000000000000008888888899999999aaaaaaaabbbbbbbb
ffffff5ff5f5ff5ff5fff5fff5f5ffff00000000000000000000000000000000000000000000000000000000000000008888888899999999aaaaaaaabbbbbbbb
ffff55fff5ff55fff5fff5fff5f5555f00000000000000000000000000000000000000000000000000000000000000008888888899999999aaaaaaaabbbbbbbb
ffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000008888888899999999aaaaaaaabbbbbbbb
ffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ccccccccddddddddeeeeeeeeffffffff
f5ff55fff5f5fffff5f5555ff5ff55ff0000000000000000000000000000000000000000000000000000000000000000ccccccccddddddddeeeeeeeeffffffff
f5f5ff5ff5f5fffff5f5fffff5f5ffff0000000000000000000000000000000000000000000000000000000000000000ccccccccddddddddeeeeeeeeffffffff
f5fff5fff5f5f5fff5ff55fff5f555ff0000000000000000000000000000000000000000000000000000000000000000ccccccccddddddddeeeeeeeeffffffff
f5ffff5ff5f5f5fff5ffff5ff5f5ff5f0000000000000000000000000000000000000000000000000000000000000000ccccccccddddddddeeeeeeeeffffffff
f5f5ff5ff5f5555ff5f5ff5ff5f5ff5f0000000000000000000000000000000000000000000000000000000000000000ccccccccddddddddeeeeeeeeffffffff
f5ff55fff5fff5fff5ff55fff5ff55ff0000000000000000000000000000000000000000000000000000000000000000ccccccccddddddddeeeeeeeeffffffff
ffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ccccccccddddddddeeeeeeeeffffffff
__gff__
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001010100000000000000010101020002010101010101000000000102010101020101000100010000000001010101010101010001010100000000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
__map__
505151515151515151515151515151524040404040404040404040404040404050515151515151515151515151514669595a5a5a5a5a5a5a5a5a5a5a5a5a5a5b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
605454545454545454545454545454624048404040404840404040404048404060000000000000000000000000000069696a6a6a6a6a6a6a6a6a6a6a6a6a6a6b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
605453535442545454545354545454624040404840404040404040404040404060000000000000000000000042000069696a6a6a6a6a6a6a6a6a6a6a6a6a6a6b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
605453535454545443545342545454624040404040404040404840404040404060000000430000420000430000000069696a6a6a6a6a6a6a6a6a6a6a6a6a6a6b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
605454545454545454545454555454624040404040404040404040404040405860000000000000000000000000000069696a6a6a6a6a6a6a6a6a6a6a6a6a6a6b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
6054545455545454dada5454755454625858404040404058404040584040405860530000000000000000000000000069696a6a6a6a6a6a6a6a6a6a6a6a6a6a6b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
605454547554545454da4254545454645151515151515151515151515151515163530000004300000042000000000079796a6a6a6a6a6a6a6a6a6a6a6a6a6a6b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
605454545454546e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e6c6a6a6a6a6a6a6a6a6a6a6a6a6a6a6b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
605454435454544f5d5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5c5d5e5e7c6a6a6a6a6a6a6a6a6a6a6a6a6a6a6b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
605454435443544f5f54545454545474717171717171717171717171717171717353000000000000000000004f5f0059596a6a6a6a6a6a6a6a6a6a6a6a6a6a6b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
605442545454544f5f54545442545462405840404058404040404058404040586053000042000000004300004f5f0069696a6a6a6a6a6a6a6a6a6a6a6a6a6a6b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
605454545454544f5f54535354545462404040404040404040404040404040586000000000000000000000004f5f4369696a6a6a6a6a6a6a6a6a6a6a6a6a6a6b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
605454544354544f5f54545354435462404040404040404040404040404040406000000000430000420000004f5f0069696a6a6a6a6a6a6a6a6a6a6a6a6a6a6b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
605353545454544f5f54545454545462404840404040404040484040404040406000004200000000000000004f5f0069696a6a6a6a6a6a6a6a6a6a6a6a6a6a6b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
605353545454544f5f54545454545462404040404040404040404040404840406000000000000000000000434f5f0079696a6a6a6a6a6a6a6a6a6a6a6a6a6a6b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
707171717171734f5f747171717171724040404040484040404040404040404070717171717171717171717644447771797a7a7a7a7a7a7a7a7a7a7a7a7a7a7b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
404040405858604f5f62584040405840c0c1c2c3d0d1d2d3e0e1e2e3f0f1f2f3505151515151515151515166444467515151515151515151515151515151515200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
404040405858604f5f62404040404040c1dcdcdcdcdcdcdcdcdcdcdcdcdcdcdc600000000000000000000000000000000000000000000000000000000000006200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
484040505151634f5f62404040404040c2dcdcdcdcdcdcdcdcdcdcdcdcdcdcdc600000000000000000000000000000004200000000000000000000420000006200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
404040605454544f5f62584058404040c3dcdcdcdcdcdcdcdcdcdcdcdcdcdcdc600000004300000000000000000000000000004300000000000000000000006200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
404040605443544f5f64515151515152d0dcdcdcdcdcdcdcdcdcdcdcdcdcdcdc600000000000000000000000430000000000000000000000000000000000006200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
404058605454554f5f54425454545462d1dcdcdcdcdcdcdcdcdcdcdcdcdcdcdc600000000000000042000000000000000000000000420000004343000000006200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
404040605442754f5f43544354555462d2dcdcdcdcdcdcdcdcdcdcdcdcdcdcdc600000430000000000000000000000420000000000000000000000000000006200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
404040605454547e4d4e4e4e6f755462d3dcdcdcdcdcdcdcdcdcdcdcdcdcdcdc600000000000000000000000000000000000000000000000000000000000006200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
40404060544354425454547e7f545462e0dcdcdcdcdcdcdcdcdcdcdcdcdcdcdc600000000000000000430000000000000000000000430000000000000042006200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
40405860545454545454435454425462e1dcdcdcdcdcdcdcdcdcdcdcdcdcdcdc600000000000000000000000420000430000000000000000000000000000006200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
40404070717171717171717171717172e2dcdcdcdcdcdcdcdcdcdcdcdcdcdcdc600000420000430000000000000000000000004300000000004300000000006200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
40404040404040404040404040404040e3dcdcdcdcdcdcdcdcdcdcdcdcdcdcdc600000000000000000000000000000000000000000000000000000000000006200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
40404040404040484040404040404040f0dcdcdcdcdcdcdcdcdcdcdcdcdcdcdc600000000000000000000000000000000000000000000000000000000000006200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
40404048404040404040404048404040f1dcdcdcdcdcdcdcdcdcdcdcdcdcdcdc600000000000000042000000004300000000000000430000004200000043006200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
48404040484040404040404840404040f2dcdcdcdcdcdcdcdcdcdcdcdcdcdcdc600000000000004300000000000074717173000000000000000000000000006200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
40404040404040404840404040404840f3dcdcdcdcdcdcdcdcdcdcdcdcdcdcdc600042000000000000000000000062405860000000000000000000000000006200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
