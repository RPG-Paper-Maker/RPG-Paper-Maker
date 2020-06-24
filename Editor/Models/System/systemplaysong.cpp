/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemplaysong.h"
#include "rpm.h"

const QString SystemPlaySong::JSON_VOLUME = "v";
const QString SystemPlaySong::JSON_IS_START = "is";
const QString SystemPlaySong::JSON_START = "s";
const QString SystemPlaySong::JSON_IS_END = "ie";
const QString SystemPlaySong::JSON_END = "e";
const QString SystemPlaySong::JSON_IS_SELECTED_BY_ID = "isbi";
const QString SystemPlaySong::JSON_VALUE_ID = "vid";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemPlaySong::SystemPlaySong() :
    SystemPlaySong(1, SongKind::Music)
{

}

SystemPlaySong::SystemPlaySong(int i, SongKind kind, PrimitiveValue *volume,
    bool isStart, PrimitiveValue *start, bool isEnd, PrimitiveValue *end, bool
    isSelectedByID, PrimitiveValue *valueID) :
    SuperListItem(i, ""),
    m_kind(kind),
    m_volume(volume),
    m_isStart(isStart),
    m_start(start),
    m_isEnd(isEnd),
    m_end(end),
    m_isSelectedByID(isSelectedByID),
    m_valueID(valueID)
{

}

SystemPlaySong::~SystemPlaySong() {
    delete m_volume;
    delete m_start;
    delete m_end;
    delete m_valueID;
}

SongKind SystemPlaySong::kind() {
    return m_kind;
}

void SystemPlaySong::setKind(SongKind k) {
    m_kind = k;
}

PrimitiveValue * SystemPlaySong::volume() const {
    return m_volume;
}

bool SystemPlaySong::isStart() const {
    return m_isStart;
}

void SystemPlaySong::setIsStart(bool b) {
    m_isStart = b;
}

PrimitiveValue * SystemPlaySong::start() const {
    return m_start;
}

bool SystemPlaySong::isEnd() const {
    return m_isEnd;
}

void SystemPlaySong::setIsEnd(bool b) {
    m_isEnd = b;
}

PrimitiveValue * SystemPlaySong::end() const {
    return m_end;
}

bool SystemPlaySong::isSelectedByID() const {
    return m_isSelectedByID;
}

void SystemPlaySong::setIsSelectedByID(bool b) {
    m_isSelectedByID = b;
}

PrimitiveValue * SystemPlaySong::valueID() const {
    return m_valueID;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemPlaySong::setDefault() {
    p_id = -1;
    m_isSelectedByID = false;
    m_volume->setKind(PrimitiveValueKind::Number);
    m_volume->setNumberValue(100);
    m_isStart = false;
    m_start->setKind(PrimitiveValueKind::Number);
    m_start->setNumberValue(0);
    m_isEnd = false;
    m_end->setKind(PrimitiveValueKind::Number);
    m_end->setNumberValue(0);
}

// -------------------------------------------------------

void SystemPlaySong::updateName() {
    if (!m_isSelectedByID)
    {
        QStandardItemModel *model = RPM::get()->project()->songsDatas()->model(
            m_kind);
        if (model != nullptr)
        {
            SuperListItem *super = SuperListItem::getById(model
                ->invisibleRootItem(), p_id);
            if (super != nullptr)
            {
                p_name = super->name();
            }
        }
    }
}

// -------------------------------------------------------

EventCommand * SystemPlaySong::createEventCommand(EventCommandKind kind) {
    EventCommand * command = new EventCommand;
    toEventCommand(*command, kind);
    return command;
}

// -------------------------------------------------------

void SystemPlaySong::toEventCommand(EventCommand& command, EventCommandKind kind)
{
    QVector<QString> list;
    list << (m_isSelectedByID ? "1" : "0");
    m_valueID->getCommandParameter(list);
    list << QString::number(p_id);
    m_volume->getCommandParameter(list);
    list << (m_isStart ? "1" : "0");
    m_start->getCommandParameter(list);
    list << (m_isEnd ? "1" : "0");
    m_end->getCommandParameter(list);

    command.setKind(kind);
    command.setCommands(list);
}

// -------------------------------------------------------

void SystemPlaySong::fromEventCommand(EventCommand& command)
{
    int i = 0;

    m_isSelectedByID = command.valueCommandAt(i++) == "1";
    m_valueID->initializeCommandParameter(&command, i);
    p_id = command.valueCommandAt(i++).toInt();
    m_volume->initializeCommandParameter(&command, i);
    m_isStart = command.valueCommandAt(i++) == "1";
    m_start->initializeCommandParameter(&command, i);
    m_isEnd = command.valueCommandAt(i++) == "1";
    m_end->initializeCommandParameter(&command, i);
}

// -------------------------------------------------------

bool SystemPlaySong::isNone() const {
    return p_id == -1 && !m_isSelectedByID;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

SuperListItem* SystemPlaySong::createCopy() const {
    SystemPlaySong* super = new SystemPlaySong;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemPlaySong::setCopy(const SuperListItem &super) {
    const SystemPlaySong *play;

    SuperListItem::setCopy(super);

    play = reinterpret_cast<const SystemPlaySong *>(&super);
    p_id = play->p_id;
    m_volume->setCopy(*play->m_volume);
    m_isStart = play->m_isStart;
    m_start->setCopy(*play->m_start);
    m_isEnd = play->m_isEnd;
    m_end->setCopy(*play->m_end);
    m_isSelectedByID = play->m_isSelectedByID;
    m_valueID->setCopy(*play->m_valueID);
    this->updateName();
}

// -------------------------------------------------------

void SystemPlaySong::read(const QJsonObject &json) {
    SuperListItem::read(json);
    QJsonObject obj;

    if (json.contains(JSON_IS_SELECTED_BY_ID)) {
        m_isSelectedByID = json[JSON_IS_SELECTED_BY_ID].toBool();
        obj = json[JSON_VALUE_ID].toObject();
        m_valueID->read(obj);
    }
    obj = json[JSON_VOLUME].toObject();
    m_volume->read(obj);
    m_isStart = json[JSON_IS_START].toBool();
    if (m_isStart) {
        obj = json[JSON_START].toObject();
        m_start->read(obj);
    }
    m_isEnd = json[JSON_IS_END].toBool();
    if (m_isEnd) {
        obj = json[JSON_END].toObject();
        m_end->read(obj);
    }

    updateName();
}

// -------------------------------------------------------

void SystemPlaySong::write(QJsonObject &json) const {
    SuperListItem::write(json);
    QJsonObject obj;

    if (m_isSelectedByID) {
        json[JSON_IS_SELECTED_BY_ID] = m_isSelectedByID;
        obj = QJsonObject();
        m_valueID->write(obj);
        json[JSON_VALUE_ID] = obj;
    }

    obj = QJsonObject();
    m_volume->write(obj);
    json[JSON_VOLUME] = obj;
    json[JSON_IS_START] = m_isStart;
    if (m_isStart) {
        obj = QJsonObject();
        m_start->write(obj);
        json[JSON_START] = obj;
    }
    json[JSON_IS_END] = m_isEnd;
    if (m_isEnd) {
        obj = QJsonObject();
        m_end->write(obj);
        json[JSON_END] = obj;
    }
}
