#include "dialogsystemfontname.h"
#include "ui_dialogsystemfontname.h"

DialogSystemFontName::DialogSystemFontName(SystemFontName &fontName, QWidget
    *parent) :
    QDialog(parent),
    m_fontName(fontName),
    ui(new Ui::DialogSystemFontName)
{
    ui->setupUi(this);

    this->initialize();
}

DialogSystemFontName::~DialogSystemFontName()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemFontName::initialize() {
    ui->lineEditName->setText(m_fontName.name());
    ui->panelPrimitiveFont->initializeMessageAndUpdate(m_fontName.font(), false);
}
