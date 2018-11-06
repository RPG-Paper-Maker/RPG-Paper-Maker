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

#include "dialogsystemkeyboard.h"
#include "ui_dialogsystemkeyboard.h"
#include <QLabel>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------


DialogSystemKeyBoard::DialogSystemKeyBoard(SystemKeyBoard& key,
                                           QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemKeyBoard),
    m_key(key)
{
    ui->setupUi(this);
    

    initialize();
}

DialogSystemKeyBoard::~DialogSystemKeyBoard()
{
    delete ui;
}

SystemKeyBoard& DialogSystemKeyBoard::key() const { return m_key; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemKeyBoard::initialize(){
    updateLabel();

    ui->label->setFocus();
    ui->buttonBox->buttons()[0]->setFocusPolicy(Qt::FocusPolicy::NoFocus);
    ui->buttonBox->buttons()[1]->setFocusPolicy(Qt::FocusPolicy::NoFocus);
}

// -------------------------------------------------------

void DialogSystemKeyBoard::updateLabel(bool wait){
    QString str = m_key.shortCutString() + " ...";

    if (wait)
        str += " [WAITING FOR A SHORTCUT]";

    ui->label->setText(str);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemKeyBoard::on_pushButtonRemoveLast_clicked(){
    m_key.removeLast();
    updateLabel();
}

// -------------------------------------------------------

void DialogSystemKeyBoard::on_pushButtonRemoveAll_clicked(){
    m_key.removeAll();
    updateLabel();
}

// -------------------------------------------------------

void DialogSystemKeyBoard::keyPressEvent(QKeyEvent* event){
    int k = event->key();
    QVector<int> newShortcut;

    m_keysPressed << k;

    // First pressure
    if (m_currentShortcut.isEmpty()){
        m_key.appendShortCut(QVector<int>());
    }

    // Update shortcut not pressed anymore
    for (int i = 0; i < m_currentShortcut.size(); i++){
        if (m_keysPressed.contains(m_currentShortcut[i]))
            newShortcut.append(m_currentShortcut[i]);
    }
    m_currentShortcut = newShortcut;

    // Add new key
    if (!m_currentShortcut.contains(k)){
        m_currentShortcut.append(k);
        m_key.updateLastShortCut(m_currentShortcut);
    }

    updateLabel(false);
}

// -------------------------------------------------------

void DialogSystemKeyBoard::keyReleaseEvent(QKeyEvent* event){
    if (!event->isAutoRepeat()){
        int k = event->key();

        m_keysPressed.remove(k);

        // If empty, stop shortcut
        if (m_keysPressed.isEmpty()){
            m_currentShortcut.clear();
            updateLabel();
        }
    }
}
