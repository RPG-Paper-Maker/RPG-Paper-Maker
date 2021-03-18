/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandshowtext.h"
#include "ui_dialogcommandshowtext.h"
#include "eventcommandkind.h"
#include "rpm.h"
#include "systemvariables.h"
#include "systemfontsize.h"
#include "systemlanguage.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandShowText::DialogCommandShowText(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandShowText)
{
    ui->setupUi(this);
    this->translate();
    this->initializeWidgets(properties, parameters);
    if (command != nullptr)
    {
        this->initialize(command);
    }
}

DialogCommandShowText::~DialogCommandShowText()
{
    delete ui;
    delete m_facesetID;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandShowText::initializeWidgets(QStandardItemModel *properties,
    QStandardItemModel *parameters)
{
    m_properties = properties;
    m_parameters = parameters;
    ui->panelPrimitiveInterlocutor->initializeMessage(false, parameters,
        m_properties);
    m_facesetID = new SuperListItem(-1);
    ui->widgetPictureFaceset->setKind(PictureKind::Facesets);
    ui->widgetPictureFaceset->initializeSuper(m_facesetID);
    QStandardItemModel *model = RPM::get()->project()->langsDatas()->model();
    QWidget *widget;
    QGridLayout *layout;
    SystemLanguage *language;
    WidgetComplexMessage *complexMessage;
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++)
    {
        language = reinterpret_cast<SystemLanguage *>(SuperListItem
            ::getItemModelAt(model, i));
        if (language != nullptr)
        {
            widget = new QWidget;
            layout = new QGridLayout(widget);
            complexMessage = new WidgetComplexMessage;
            complexMessage->initializeWidgets(m_properties, m_parameters);
            m_widgets.insert(language->id(), complexMessage);
            layout->addWidget(complexMessage, 0, 0);
            ui->tabWidget->insertTab(i, widget, language->name());
        }
    }
}

//-------------------------------------------------

void DialogCommandShowText::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SHOW_TEXT) + RPM
        ::DOT_DOT_DOT);
    ui->labelFaceset->setText(RPM::translate(Translations::FACESET) + RPM
        ::COLON);
    ui->labelInterlocutor->setText(RPM::translate(Translations::INTERLOCUTOR) +
        RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandShowText::getCommand() const
{
    QVector<QString> command;
    ui->panelPrimitiveInterlocutor->getCommand(command);
    command.append(QString::number(m_facesetID->id()));
    QHash<int, WidgetComplexMessage *>::const_iterator i;
    for (i = m_widgets.begin(); i != m_widgets.end(); i++)
    {
        command.append(QString::number(i.key()));
        command.append(i.value()->text());
    }
    return new EventCommand(EventCommandKind::ShowText, command);
}

// -------------------------------------------------------

void DialogCommandShowText::initialize(EventCommand *command)
{
    int i = 0;
    ui->panelPrimitiveInterlocutor->initializeCommand(command, i);
    m_facesetID->setId(command->valueCommandAt(i++).toInt());
    ui->widgetPictureFaceset->initializeSuper(m_facesetID);
    int id;
    QString text;
    WidgetComplexMessage *widget;
    while (i < command->commandsCount())
    {
        id = command->valueCommandAt(i++).toInt();
        text = command->valueCommandAt(i++);
        widget = m_widgets.value(id);
        if (widget != nullptr)
        {
            widget->setText(text);
        }
    }
}
