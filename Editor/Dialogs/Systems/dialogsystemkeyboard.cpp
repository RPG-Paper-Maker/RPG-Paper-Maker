/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemkeyboard.h"
#include "ui_dialogsystemkeyboard.h"
#include <QLabel>
#include "rpm.h"

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

    this->translate();
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
    QString str;

    str = m_key.shortCutString() + RPM::SPACE + RPM::DOT_DOT_DOT;
    if (wait) {
        str += RPM::SPACE + RPM::BRACKET_LEFT + RPM::translate(Translations
            ::WAITING_FOR_SHORTCUT).toUpper() + RPM::BRACKET_RIGHT;
    }
    ui->label->setText(str);
}

//-------------------------------------------------

void DialogSystemKeyBoard::translate()
{
    this->setWindowTitle(RPM::translate(Translations::ENTER_SHORTCUTS) + RPM
        ::DOT_DOT_DOT);
    ui->pushButtonRemoveAll->setText(RPM::translate(Translations::REMOVE_ALL));
    ui->pushButtonRemoveLast->setText(RPM::translate(Translations::REMOVE_LAST));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
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
