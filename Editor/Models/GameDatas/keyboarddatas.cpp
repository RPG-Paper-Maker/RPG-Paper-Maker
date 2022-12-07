/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "keyboarddatas.h"
#include "superlistitem.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

KeyBoardDatas::KeyBoardDatas()
{
    m_model = new QStandardItemModel;
}

KeyBoardDatas::~KeyBoardDatas()
{
    SuperListItem::deleteModel(m_model);
}

void KeyBoardDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_KEYBOARD), *this);
}

QStandardItemModel* KeyBoardDatas::model() const { return m_model; }

int KeyBoardDatas::keyAction() const { return m_keyAction; }

int KeyBoardDatas::keyCancel() const { return m_keyCancel; }

int KeyBoardDatas::keyUp() const { return m_keyUp; }

int KeyBoardDatas::keyDown() const { return m_keyDown; }

int KeyBoardDatas::keyLeft() const { return m_keyLeft; }

int KeyBoardDatas::keyRight() const { return m_keyRight; }

void KeyBoardDatas::setKeyAction(int k) { m_keyAction = k; }

void KeyBoardDatas::setKeyCancel(int k) { m_keyCancel = k; }

void KeyBoardDatas::setKeyUp(int k) { m_keyUp = k; }

void KeyBoardDatas::setKeyDown(int k) { m_keyDown = k; }

void KeyBoardDatas::setKeyLeft(int k) { m_keyLeft = k; }

void KeyBoardDatas::setKeyRight(int k) { m_keyRight = k; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void KeyBoardDatas::setDefaultEngine(){
    SystemKeyBoard* super;
    QVector<SystemKeyBoard*> list;
    int i = 1;

    // Keys assigns
    super = new SystemKeyBoard(i++, RPM::translate(Translations::MOVE_CURSOR_UP), "CursorUp");
    super->appendShortCut(QVector<int>({16777235}));
    super->appendShortCut(QVector<int>({87}));
    list.append(super);
    super = new SystemKeyBoard(i++, RPM::translate(Translations::MOVE_CURSOR_DOWN), "CursorDown");
    super->appendShortCut(QVector<int>({16777237}));
    super->appendShortCut(QVector<int>({83}));
    list.append(super);
    super = new SystemKeyBoard(i++, RPM::translate(Translations::MOVE_CURSOR_LEFT), "CursorLeft");
    super->appendShortCut(QVector<int>({16777234}));
    super->appendShortCut(QVector<int>({65}));
    list.append(super);
    super = new SystemKeyBoard(i++, RPM::translate(Translations::MOVE_CURSOR_RIGHT), "CursorRight");
    super->appendShortCut(QVector<int>({16777236}));
    super->appendShortCut(QVector<int>({68}));
    list.append(super);
    setDefault(list);

    // Menu controls
    m_keyAction = 0;
    m_keyCancel = 0;
    m_keyUp = 0;
    m_keyDown = 0;
    m_keyLeft = 0;
    m_keyRight = 0;
}

// -------------------------------------------------------

void KeyBoardDatas::setDefaultGame(){
    SystemKeyBoard* super;
    QVector<SystemKeyBoard*> list;
    int i = 1;

    // Keys assigns
    super = new SystemKeyBoard(i++, RPM::translate(Translations::MOVE_HERO_UP), "UpHero");
    super->appendShortCut(QVector<int>({87}));
    list.append(super);
    super = new SystemKeyBoard(i++, RPM::translate(Translations::MOVE_HERO_DOWN), "DownHero");
    super->appendShortCut(QVector<int>({83}));
    list.append(super);
    super = new SystemKeyBoard(i++, RPM::translate(Translations::MOVE_HERO_LEFT), "LeftHero");
    super->appendShortCut(QVector<int>({65}));
    list.append(super);
    super = new SystemKeyBoard(i++, RPM::translate(Translations::MOVE_HERO_RIGHT), "RightHero");
    super->appendShortCut(QVector<int>({68}));
    list.append(super);
    super = new SystemKeyBoard(i++, RPM::translate(Translations::MOVE_MENU_UP), "UpMenu");
    super->appendShortCut(QVector<int>({16777235}));
    super->appendShortCut(QVector<int>({87}));
    list.append(super);
    super = new SystemKeyBoard(i++, RPM::translate(Translations::MOVE_MENU_DOWN), "DownMenu");
    super->appendShortCut(QVector<int>({16777237}));
    super->appendShortCut(QVector<int>({83}));
    list.append(super);
    super = new SystemKeyBoard(i++, RPM::translate(Translations::MOVE_MENU_LEFT), "LeftMenu");
    super->appendShortCut(QVector<int>({16777234}));
    super->appendShortCut(QVector<int>({65}));
    list.append(super);
    super = new SystemKeyBoard(i++, RPM::translate(Translations::MOVE_MENU_RIGHT), "RightMenu");
    super->appendShortCut(QVector<int>({16777236}));
    super->appendShortCut(QVector<int>({68}));
    list.append(super);
    super = new SystemKeyBoard(i++, RPM::translate(Translations::MOVE_CAMERA_LEFT), "LeftCamera");
    super->appendShortCut(QVector<int>({16777234}));
    list.append(super);
    super = new SystemKeyBoard(i++, RPM::translate(Translations::MOVE_CAMERA_RIGHT), "RightCamera");
    super->appendShortCut(QVector<int>({16777236}));
    list.append(super);
    super = new SystemKeyBoard(i++, RPM::translate(Translations::ACTION), "Action");
    super->appendShortCut(QVector<int>({16777220}));
    super->appendShortCut(QVector<int>({16777221}));
    list.append(super);
    super = new SystemKeyBoard(i++, RPM::translate(Translations::CANCEL), "Cancel");
    super->appendShortCut(QVector<int>({88}));
    super->appendShortCut(QVector<int>({16777216}));
    list.append(super);
    super = new SystemKeyBoard(i++, RPM::translate(Translations::OPEN_CLOSE_MAIN_MENU), "MainMenu");
    super->appendShortCut(QVector<int>({16777216}));
    list.append(super);
    setDefault(list);

    // Menu controls
    m_keyAction = 11;
    m_keyCancel = 12;
    m_keyUp = 5;
    m_keyDown = 6;
    m_keyLeft = 7;
    m_keyRight = 8;
}

// -------------------------------------------------------

void KeyBoardDatas::setDefault(QVector<SystemKeyBoard *> &list){
    SystemKeyBoard* super;
    QList<QStandardItem*> row;

    for (int i = 0; i < list.size(); i++){
        super = list.at(i);
        row = super->getModelRow();
        m_model->appendRow(row);
    }
}

void KeyBoardDatas::setDefaultTranslations()
{
    SuperListItem::setModelItemName(m_model, 0, RPM::translate(Translations::MOVE_HERO_UP));
    SuperListItem::setModelItemName(m_model, 1, RPM::translate(Translations::MOVE_HERO_DOWN));
    SuperListItem::setModelItemName(m_model, 2, RPM::translate(Translations::MOVE_HERO_LEFT));
    SuperListItem::setModelItemName(m_model, 3, RPM::translate(Translations::MOVE_HERO_RIGHT));
    SuperListItem::setModelItemName(m_model, 4, RPM::translate(Translations::MOVE_MENU_UP));
    SuperListItem::setModelItemName(m_model, 5, RPM::translate(Translations::MOVE_MENU_DOWN));
    SuperListItem::setModelItemName(m_model, 6, RPM::translate(Translations::MOVE_MENU_LEFT));
    SuperListItem::setModelItemName(m_model, 7, RPM::translate(Translations::MOVE_MENU_RIGHT));
    SuperListItem::setModelItemName(m_model, 8, RPM::translate(Translations::MOVE_CAMERA_LEFT));
    SuperListItem::setModelItemName(m_model, 9, RPM::translate(Translations::MOVE_CAMERA_RIGHT));
    SuperListItem::setModelItemName(m_model, 10, RPM::translate(Translations::ACTION));
    SuperListItem::setModelItemName(m_model, 11, RPM::translate(Translations::CANCEL));
    SuperListItem::setModelItemName(m_model, 12, RPM::translate(Translations::OPEN_CLOSE_MAIN_MENU));
}

// -------------------------------------------------------

bool KeyBoardDatas::isEqual(int key, KeyBoardEngineKind kind) const {
    int idKey = (int) kind;
    SystemKeyBoard* super = ((SystemKeyBoard*) m_model->item(idKey)->data()
                             .value<quintptr>());

    return super->isEqual(key);
}

// -------------------------------------------------------

bool KeyBoardDatas::contains(QSet<int> keysPressed,
                             KeyBoardEngineKind kind) const
{
    QSet<int>::iterator i;
    for (i = keysPressed.begin(); i != keysPressed.end(); i++) {
        if (isEqual(*i, kind))
            return true;
    }

    return false;
}

// -------------------------------------------------------

void KeyBoardDatas::updateHeader(){
    m_model->setHorizontalHeaderLabels(QStringList({
       RPM::translate(Translations::ABBREVIATION),
       RPM::translate(Translations::DESCRIPTION),
       RPM::translate(Translations::SHORTCUT)
    }));
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void KeyBoardDatas::read(const QJsonObject &json){
    QList<QStandardItem*> row;
    QJsonArray tab = json["list"].toArray();

    // Clear
    SuperListItem::deleteModel(m_model, false);
    updateHeader();

    // Controls
    for (int i = 0; i < tab.size(); i++){
        SystemKeyBoard* super = new SystemKeyBoard;
        super->read(tab[i].toObject());
        row = super->getModelRow();
        m_model->appendRow(row);
    }

    // Menu controls
    m_keyAction = json["a"].toInt();
    m_keyCancel = json["c"].toInt();
    m_keyUp = json["u"].toInt();
    m_keyDown = json["d"].toInt();
    m_keyLeft = json["l"].toInt();
    m_keyRight = json["r"].toInt();
}

// -------------------------------------------------------

void KeyBoardDatas::write(QJsonObject &json) const{
    QJsonArray tab;

    // Controls
    for (int i = 0; i < m_model->invisibleRootItem()->rowCount(); i++){
        QJsonObject jsonKey;
        SystemKeyBoard* super = ((SystemKeyBoard*)m_model->item(i)->data()
                                 .value<quintptr>());

        if (super != nullptr){
            super->write(jsonKey);
            tab.append(jsonKey);
        }
    }
    json["list"] = tab;

    // Menu controls
    json["a"] = m_keyAction;
    json["c"] = m_keyCancel;
    json["u"] = m_keyUp;
    json["d"] = m_keyDown;
    json["l"] = m_keyLeft;
    json["r"] = m_keyRight;
}
