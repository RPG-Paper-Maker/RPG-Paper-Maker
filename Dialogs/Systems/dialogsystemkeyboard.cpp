/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
