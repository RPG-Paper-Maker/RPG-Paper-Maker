/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemstate.h"
#include "systemobjectevent.h"
#include "systemcommonreaction.h"
#include "dialogsystemstate.h"
#include "rpm.h"

const QString SystemState::JSON_OBJECT_MOVING_KIND = "omk";
const QString SystemState::JSON_EVENT_COMMAND_ROUTE = "ecr";
const QString SystemState::JSON_SPEED_ID = "s";
const QString SystemState::JSON_FREQUENCY_ID = "f";
const QString SystemState::JSON_EVENT_COMMAND_DETECTION = "ecd";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemState::SystemState() :
    SystemState(SuperListItem::getById(RPM::get()->project()->gameDatas()
        ->commonEventsDatas()->modelStates()->invisibleRootItem(), 1),
        MapEditorSubSelectionKind::None, -1, 0, 0, ObjectMovingKind::Fix,
        nullptr, 1, 1, false, false, false, false, false, false, false, false,
        nullptr)
{

}

SystemState::SystemState(SuperListItem *state, MapEditorSubSelectionKind gk, int
    gid, int x, int y, ObjectMovingKind omk, EventCommand *ecr, int sp, int fr,
    bool m, bool s, bool cl, bool d, bool t, bool c, bool p, bool k,
    EventCommand *ecd) :
    SuperListItem(state->id(), state->name()),
    m_state(state),
    m_graphicsKind(gk),
    m_graphicsId(gid),
    m_indexX(x),
    m_indexY(y),
    m_objectMovingKind(omk),
    m_eventCommandRoute(ecd),
    m_speedID(sp),
    m_frequencyID(fr),
    m_moveAnimation(m),
    m_stopAnimation(s),
    m_climbAnimation(cl),
    m_directionFix(d),
    m_through(t),
    m_setWithCamera(c),
    m_pixelOffset(p),
    m_keepPosition(k),
    m_eventCommandDetection(ecr)
{

}

SystemState::~SystemState() {
    this->removeRoute();
    this->removeDetection();
}

QString SystemState::name() const { return m_state->name(); }

SuperListItem* SystemState::state() const { return m_state; }

void SystemState::setState(SuperListItem* s) {
    m_state = s;
    setId(m_state->id());
    setName(m_state->name());
}

MapEditorSubSelectionKind SystemState::graphicsKind() const {
    return m_graphicsKind;
}

void SystemState::setGraphicsKind(MapEditorSubSelectionKind k) {
    m_graphicsKind = k;
}

int SystemState::graphicsId() const { return m_graphicsId; }

void SystemState::setGraphicsId(int i) { m_graphicsId = i; }

int SystemState::indexX() const { return m_indexX; }

void SystemState::setIndexX(int i) { m_indexX = i; }

int SystemState::indexY() const { return m_indexY; }

void SystemState::setIndexY(int i) { m_indexY = i; }

QRect SystemState::rectTileset() const {
    return m_rectTileset;
}

void SystemState::setRectTileset(QRect rect) {
    m_rectTileset = rect;
}

ObjectMovingKind SystemState::objectMovingKind() const {
    return m_objectMovingKind;
}

void SystemState::setObjectMovingKind(ObjectMovingKind k) {
    m_objectMovingKind = k;
}

EventCommand * SystemState::eventCommandRoute() const {
    return m_eventCommandRoute;
}

void SystemState::setEventCommandRoute(EventCommand *ecr) {
    m_eventCommandRoute = ecr;
}

int SystemState::speedID() const {
    return m_speedID;
}

void SystemState::setSpeedID(int s) {
    m_speedID = s;
}

int SystemState::frequencyID() const {
    return m_frequencyID;
}

void SystemState::setFrequencyID(int f) {
    m_frequencyID = f;
}

bool SystemState::moveAnimation() const { return m_moveAnimation; }

bool SystemState::stopAnimation() const { return m_stopAnimation; }

bool SystemState::climbAnimation() const { return m_climbAnimation; }

bool SystemState::directionFix() const { return m_directionFix; }

bool SystemState::through() const { return m_through; }

bool SystemState::setWithCamera() const { return m_setWithCamera; }

bool SystemState::pixelOffset() const { return m_pixelOffset; }

bool SystemState::keepPosition() const { return m_keepPosition; }

void SystemState::setMoveAnimation(bool b) { m_moveAnimation = b; }

void SystemState::setStopAnimation(bool b) { m_stopAnimation = b; }

void SystemState::setClimbAnimation(bool b) { m_climbAnimation = b; }

void SystemState::setDirectionFix(bool b) { m_directionFix = b; }

void SystemState::setThrough(bool b) { m_through = b; }

void SystemState::setSetWithCamera(bool b) { m_setWithCamera = b; }

void SystemState::setPixelOffset(bool b) { m_pixelOffset = b; }

void SystemState::setKeepPosition(bool b) { m_keepPosition = b; }

EventCommand * SystemState::eventCommandDetection() const {
    return m_eventCommandDetection;
}

void SystemState::setEventCommandDetection(EventCommand *ecd) {
    m_eventCommandDetection = ecd;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemState::removeRoute() {
    if (m_eventCommandRoute != nullptr) {
        delete m_eventCommandRoute;
        m_eventCommandRoute = nullptr;
    }
}

// -------------------------------------------------------

void SystemState::removeDetection() {
    if (m_eventCommandDetection != nullptr) {
        delete m_eventCommandDetection;
        m_eventCommandDetection = nullptr;
    }
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemState::openDialog() {
    SystemState super;
    super.setCopy(*this);
    DialogSystemState dialog(super);
    if (dialog.exec() == QDialog::Accepted) {
        setCopy(super);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemState::createCopy() const {
    SystemState* super = new SystemState;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemState::setCopy(const SuperListItem &super) {
    const SystemState *state;

    SuperListItem::setCopy(super);

    state = reinterpret_cast<const SystemState *>(&super);
    p_id = state->p_id;
    m_state = state->m_state;
    m_graphicsId = state->m_graphicsId;
    m_graphicsKind = state->m_graphicsKind;
    m_indexX = state->m_indexX;
    m_indexY = state->m_indexY;
    m_rectTileset = state->m_rectTileset;
    m_objectMovingKind = state->m_objectMovingKind;
    this->removeRoute();
    if (state->m_eventCommandRoute != nullptr) {
        m_eventCommandRoute = new EventCommand;
        m_eventCommandRoute->setCopy(*state->m_eventCommandRoute);
    }
    m_speedID = state->m_speedID;
    m_frequencyID = state->m_frequencyID;
    m_moveAnimation = state->m_moveAnimation;
    m_stopAnimation = state->m_stopAnimation;
    m_climbAnimation = state->m_climbAnimation;
    m_directionFix = state->m_directionFix;
    m_through = state->m_through;
    m_setWithCamera = state->m_setWithCamera;
    m_pixelOffset = state->m_pixelOffset;
    m_keepPosition = state->m_keepPosition;
    this->removeDetection();
    if (state->m_eventCommandDetection!= nullptr) {
        m_eventCommandDetection = new EventCommand;
        m_eventCommandDetection->setCopy(*state->m_eventCommandDetection);
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemState::read(const QJsonObject &json) {
    SuperListItem::read(json);
    QJsonArray tab;

    setState(SuperListItem::getById(RPM::get()->project()->gameDatas()
                                    ->commonEventsDatas()->modelStates()
                                    ->invisibleRootItem(), id()));
    m_graphicsKind = static_cast<MapEditorSubSelectionKind>(json["gk"].toInt());
    m_graphicsId = json["gid"].toInt();
    if (m_graphicsId == 0) {
        tab = json["rt"].toArray();
        m_rectTileset = QRect(tab[0].toInt(), tab[1].toInt(), tab[2].toInt(), tab[3]
            .toInt());
    } else {
        m_indexX = json["x"].toInt();
        m_indexY = json["y"].toInt();
    }
    if (json.contains(JSON_OBJECT_MOVING_KIND)) {
        m_objectMovingKind = static_cast<ObjectMovingKind>(json[
            JSON_OBJECT_MOVING_KIND].toInt());
    }
    if (json.contains(JSON_EVENT_COMMAND_ROUTE)) {
        m_eventCommandRoute = new EventCommand;
        m_eventCommandRoute->read(json[JSON_EVENT_COMMAND_ROUTE].toObject());
    } else {
        m_eventCommandRoute = nullptr;
    }
    if (json.contains(JSON_SPEED_ID)) {
        m_speedID = json[JSON_SPEED_ID].toInt();
    }
    if (json.contains(JSON_FREQUENCY_ID)) {
        m_frequencyID = json[JSON_FREQUENCY_ID].toInt();
    }
    m_moveAnimation = json["move"].toBool();
    m_stopAnimation = json["stop"].toBool();
    m_climbAnimation = json["climb"].toBool();
    m_directionFix = json["dir"].toBool();
    m_through = json["through"].toBool();
    m_setWithCamera = json["cam"].toBool();
    m_pixelOffset = json["pix"].toBool();
    m_keepPosition = json["pos"].toBool();
    if (json.contains(JSON_EVENT_COMMAND_DETECTION)) {
        m_eventCommandDetection = new EventCommand;
        m_eventCommandDetection->read(json[JSON_EVENT_COMMAND_DETECTION]
            .toObject());
    } else {
        m_eventCommandDetection = nullptr;
    }
}

// -------------------------------------------------------

void SystemState::write(QJsonObject &json) const {
    SuperListItem::write(json);
    QJsonArray tab;
    QJsonObject obj;

    json["gk"] = static_cast<int>(m_graphicsKind);
    json["gid"] = m_graphicsId;
    if (m_graphicsId == 0) {
        tab.append(m_rectTileset.x());
        tab.append(m_rectTileset.y());
        tab.append(m_rectTileset.width());
        tab.append(m_rectTileset.height());
        json["rt"] = tab;
    } else {
        json["x"] = m_indexX;
        json["y"] = m_indexY;
    }
    if (m_objectMovingKind != ObjectMovingKind::Fix) {
        json[JSON_OBJECT_MOVING_KIND] = static_cast<int>(m_objectMovingKind);
    }
    if (m_eventCommandRoute != nullptr) {
        obj = m_eventCommandRoute->getJSON();
        json[JSON_EVENT_COMMAND_ROUTE] = obj;
    }
    if (m_speedID != 1) {
        json[JSON_SPEED_ID] = m_speedID;
    }
    if (m_frequencyID != 1) {
        json[JSON_FREQUENCY_ID] = m_frequencyID;
    }
    json["move"] = m_moveAnimation;
    json["stop"] = m_stopAnimation;
    json["climb"] = m_climbAnimation;
    json["dir"] = m_directionFix;
    json["through"] = m_through;
    json["cam"] = m_setWithCamera;
    json["pix"] = m_pixelOffset;
    json["pos"] = m_keepPosition;
    if (m_eventCommandDetection != nullptr) {
        obj = m_eventCommandDetection->getJSON();
        json[JSON_EVENT_COMMAND_DETECTION] = obj;
    }
}
