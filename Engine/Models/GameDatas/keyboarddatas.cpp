/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "keyboarddatas.h"
#include "superlistitem.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

KeyBoardDatas::KeyBoardDatas()
{
    m_model = new QStandardItemModel;
    m_model->setHorizontalHeaderLabels(QStringList({"Description"}));
}

KeyBoardDatas::~KeyBoardDatas()
{
    SuperListItem::deleteModel(m_model);
}

void KeyBoardDatas::read(QString path){
    Wanok::readJSON(Wanok::pathCombine(path, Wanok::pathKeyBoard), *this);
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
    super = new SystemKeyBoard(i++, new LangsTranslation("Move cursor up"),
                               "CursorUp");
    super->appendShortCut(QVector<int>({38}));
    super->appendShortCut(QVector<int>({90}));
    list.append(super);
    super = new SystemKeyBoard(i++, new LangsTranslation("Move cursor down"),
                               "CursorDown");
    super->appendShortCut(QVector<int>({40}));
    super->appendShortCut(QVector<int>({83}));
    list.append(super);
    super = new SystemKeyBoard(i++, new LangsTranslation("Move cursor left"),
                               "CursorLeft");
    super->appendShortCut(QVector<int>({37}));
    super->appendShortCut(QVector<int>({81}));
    list.append(super);
    super = new SystemKeyBoard(i++, new LangsTranslation("Move cursor right"),
                               "CursorRight");
    super->appendShortCut(QVector<int>({39}));
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
    super = new SystemKeyBoard(i++, new LangsTranslation("Move up"),
                               "Up");
    super->appendShortCut(QVector<int>({38}));
    super->appendShortCut(QVector<int>({90}));
    list.append(super);
    super = new SystemKeyBoard(i++, new LangsTranslation("Move down"),
                               "Down");
    super->appendShortCut(QVector<int>({40}));
    super->appendShortCut(QVector<int>({83}));
    list.append(super);
    super = new SystemKeyBoard(i++, new LangsTranslation("Move left"),
                               "Left");
    super->appendShortCut(QVector<int>({37}));
    super->appendShortCut(QVector<int>({81}));
    list.append(super);
    super = new SystemKeyBoard(i++, new LangsTranslation("Move right"),
                               "Right");
    super->appendShortCut(QVector<int>({39}));
    super->appendShortCut(QVector<int>({68}));
    list.append(super);
    super = new SystemKeyBoard(i++, new LangsTranslation("Action"),
                               "Action");
    super->appendShortCut(QVector<int>({13}));
    list.append(super);
    super = new SystemKeyBoard(i++, new LangsTranslation("Cancel"),
                               "Cancel");
    super->appendShortCut(QVector<int>({88}));
    list.append(super);
    super = new SystemKeyBoard(i++,
                               new LangsTranslation("Open / Close main menu"),
                               "MainMenu");
    super->appendShortCut(QVector<int>({27}));
    list.append(super);
    setDefault(list);

    // Menu controls
    m_keyAction = 5;
    m_keyCancel = 6;
    m_keyUp = 1;
    m_keyDown = 2;
    m_keyLeft = 3;
    m_keyRight = 4;
}

// -------------------------------------------------------

void KeyBoardDatas::setDefault(QVector<SystemKeyBoard *> &list){
    QStandardItem* item;
    SystemKeyBoard* super;

    for (int i = 0; i < list.size(); i++){
        super = list.at(i);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(super->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void KeyBoardDatas::read(const QJsonObject &json){
    QJsonArray tab = json["list"].toArray();

    // Controls
    for (int i = 0; i < tab.size(); i++){
        QStandardItem* item = new QStandardItem;
        SystemKeyBoard* super = new SystemKeyBoard;
        super->read(tab[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(super->toString());
        m_model->appendRow(item);
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
        super->write(jsonKey);
        tab.append(jsonKey);
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
