/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "titlescreengameoverdatas.h"
#include "rpm.h"
#include "common.h"
#include "systemtitlecommand.h"

const QString TitleScreenGameOverDatas::JSON_IS_TITLE_BACKGROUND_IMAGE = "itbi";
const QString TitleScreenGameOverDatas::JSON_TITLE_BACKGROUND_IMAGE = "tb";
const QString TitleScreenGameOverDatas::JSON_TITLE_BACKGROUND_VIDEO = "tbv";
const QString TitleScreenGameOverDatas::JSON_TITLE_MUSIC = "tm";
const QString TitleScreenGameOverDatas::JSON_TITLE_COMMANDS = "tc";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

TitleScreenGameOverDatas::TitleScreenGameOverDatas() :
    m_isBackgroundImage(true),
    m_titleBackgroundImageID(new SuperListItem),
    m_titleBackgroundVideoID(new SuperListItem),
    m_titleMusic(new SystemPlaySong(-1, SongKind::Music)),
    m_modelTitleCommands(new QStandardItemModel)
{

}

TitleScreenGameOverDatas::~TitleScreenGameOverDatas() {
    delete m_titleBackgroundImageID;
    delete m_titleBackgroundVideoID;
    delete m_titleMusic;
    SuperListItem::deleteModel(m_modelTitleCommands);
}

bool TitleScreenGameOverDatas::isBackgroundImage() const {
    return m_isBackgroundImage;
}

void TitleScreenGameOverDatas::setIsBackgroundImage(bool b) {
    m_isBackgroundImage = b;
}

SuperListItem * TitleScreenGameOverDatas::titleBackgroundImageID() const {
    return m_titleBackgroundImageID;
}

SuperListItem * TitleScreenGameOverDatas::titleBackgroundVideoID() const {
    return m_titleBackgroundVideoID;
}

SystemPlaySong * TitleScreenGameOverDatas::titleMusic() const {
    return m_titleMusic;
}

QStandardItemModel * TitleScreenGameOverDatas::modelTitleCommands() const {
    return m_modelTitleCommands;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void TitleScreenGameOverDatas::read(QString path){
    Common::readJSON(Common::pathCombine(path, RPM::PATH_TITLE_SCREEN_GAME_OVER),
        *this);
}

// -------------------------------------------------------

void TitleScreenGameOverDatas::setDefault() {
    m_titleBackgroundImageID->setId(1);
    m_titleBackgroundVideoID->setId(-1);
    m_titleMusic->setId(1);
    m_modelTitleCommands->appendRow((new SystemTitleCommand(-1, new
        LangsTranslation("New game"), TitleCommandKind::NewGame))->getModelRow());
    m_modelTitleCommands->appendRow((new SystemTitleCommand(-1, new
        LangsTranslation("Load game"), TitleCommandKind::LoadGame))->getModelRow());
    m_modelTitleCommands->appendRow((new SystemTitleCommand(-1, new
        LangsTranslation("Options"), TitleCommandKind::Options))->getModelRow());
    m_modelTitleCommands->appendRow((new SystemTitleCommand(-1, new
        LangsTranslation("Exit"), TitleCommandKind::Exit))->getModelRow());
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void TitleScreenGameOverDatas::read(const QJsonObject &json) {
    SystemTitleCommand *titleCommand;
    QJsonArray tab;
    int i, l;

    // Clear
    SuperListItem::deleteModel(m_modelTitleCommands, false);

    // Title screen
    if (json.contains(JSON_IS_TITLE_BACKGROUND_IMAGE)) {
        m_isBackgroundImage = json[JSON_IS_TITLE_BACKGROUND_IMAGE].toBool();
    }
    if (json.contains(JSON_TITLE_BACKGROUND_IMAGE)) {
        m_titleBackgroundImageID->setId(json[JSON_TITLE_BACKGROUND_IMAGE].toInt());
    }
    if (json.contains(JSON_TITLE_BACKGROUND_VIDEO)) {
        m_titleBackgroundVideoID->setId(json[JSON_TITLE_BACKGROUND_VIDEO].toInt());
    }
    m_titleMusic->read(json[JSON_TITLE_MUSIC].toObject());
    tab = json[JSON_TITLE_COMMANDS].toArray();
    for (i = 0, l = tab.size(); i < l; i++) {
        titleCommand = new SystemTitleCommand;
        titleCommand->read(tab.at(i).toObject());
        m_modelTitleCommands->appendRow(titleCommand->getModelRow());
    }
}

// -------------------------------------------------------

void TitleScreenGameOverDatas::write(QJsonObject &json) const {
    QJsonObject obj;
    QJsonArray tab;
    int i, l;

    if (m_isBackgroundImage) {
        if (!m_titleBackgroundImageID->isDefault()) {
            json[JSON_TITLE_BACKGROUND_IMAGE] = m_titleBackgroundImageID->id();
        }
    } else {
        json[JSON_IS_TITLE_BACKGROUND_IMAGE] = m_isBackgroundImage;
        if (m_titleBackgroundVideoID->id() != -1) {
            json[JSON_TITLE_BACKGROUND_VIDEO] = m_titleBackgroundVideoID->id();
        }
    }
    obj = QJsonObject();
    m_titleMusic->write(obj);
    json[JSON_TITLE_MUSIC] = obj;
    for (i = 0, l = m_modelTitleCommands->invisibleRootItem()->rowCount(); i < l
         ; i++)
    {
        obj = QJsonObject();
        reinterpret_cast<SystemTitleCommand *>(m_modelTitleCommands->item(i)
            ->data().value<quintptr>())->write(obj);
        tab.append(obj);
    }
    if (!tab.isEmpty()) {
        json[JSON_TITLE_COMMANDS] = tab;
    }
}
