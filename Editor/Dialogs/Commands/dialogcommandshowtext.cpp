/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDir>
#include "dialogcommandshowtext.h"
#include "ui_dialogcommandshowtext.h"
#include "eventcommandkind.h"
#include "rpm.h"
#include "common.h"
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
    m_gameProcess(new QProcess(this)),
    m_timer(new QTimer),
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
    m_gameProcess->close();
    delete m_gameProcess;
    delete m_timer;
    delete ui;
    delete m_facesetID;
    delete m_facesetIndexX;
    delete m_facesetIndexY;
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
    m_facesetIndexX = new SuperListItem(0);
    m_facesetIndexY = new SuperListItem(0);
    ui->widgetPictureFaceset->setKind(PictureKind::Facesets);
    ui->widgetPictureFaceset->initializeSuper(m_facesetID, m_facesetIndexX, m_facesetIndexY);
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
    ui->pushButtonPreview->setText(RPM::translate(Translations::PREVIEW) + RPM::DOT_DOT_DOT);
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
    command.append(QString::number(m_facesetIndexX->id()));
    command.append(QString::number(m_facesetIndexY->id()));
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
    m_facesetIndexX->setId(command->valueCommandAt(i++).toInt());
    m_facesetIndexY->setId(command->valueCommandAt(i++).toInt());
    ui->widgetPictureFaceset->initializeSuper(m_facesetID, m_facesetIndexX,
        m_facesetIndexY);
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

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandShowText::accept()
{
    QDir(Common::pathCombine(RPM::get()->project()->pathCurrentProjectApp(), "Test"))
        .removeRecursively();
    QDialog::accept();
}

// -------------------------------------------------------

void DialogCommandShowText::reject()
{
    QDir(Common::pathCombine(RPM::get()->project()->pathCurrentProjectApp(), "Test"))
        .removeRecursively();
    QDialog::reject();
}

// -------------------------------------------------------

void DialogCommandShowText::on_pushButtonPreview_clicked()
{
    m_timer->start(1);
    connect(m_timer, SIGNAL(timeout()), this, SLOT(updateTestFile()));
    this->updateTestFile();

    // Run app test
    QString execName = "Game";
    #ifdef Q_OS_WIN
        execName += ".exe";
    #elif __linux__
        execName += "";
    #else
        execName += ".app";
    #endif
    if (m_gameProcess->isOpen()) {
        m_gameProcess->close();
    }
    QStringList arguments;
    arguments << "--modeTest" << "showTextPreview";
    #ifdef Q_OS_WIN
        m_gameProcess->start("\"" + Common::pathCombine(RPM::get()->project()
            ->pathCurrentProject(), execName) + "\"", arguments);
    #else
        m_gameProcess->start("\"" + Common::pathCombine(RPM::get()->project()
            ->pathCurrentProject(), execName) + "\" \"" + arguments.at(0) + "\" \""
            + arguments.at(1) + "\"");
    #endif
}

//-------------------------------------------------

void DialogCommandShowText::updateTestFile()
{
    EventCommand *command = this->getCommand();
    QJsonObject obj = command->getJSON();
    QDir(RPM::get()->project()->pathCurrentProjectApp()).mkdir("Test");
    Common::writeOtherJSON(Common::pathCombine(Common::pathCombine(RPM::get()
        ->project()->pathCurrentProjectApp(), "Test"), "test.json"), obj);
    delete command;
}
